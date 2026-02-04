import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query, transaction } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { env } from '../config/env.js';
import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from '../utils/validation.js';
import {
  blacklistToken,
  storeRefreshToken,
  isRefreshTokenValid,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  storeResetToken,
  getResetTokenUserId,
  deleteResetToken,
} from '../config/redis.js';
import logger from '../utils/logger.js';

// Cookie configuration
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
  domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
});

// Generate access token (short-lived)
const generateAccessToken = (id: string, email: string, userType: string): string => {
  return jwt.sign(
    { id, email, userType, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as any
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (id: string): string => {
  return jwt.sign(
    { id, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as any
  );
};

// Parse duration string to milliseconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000; // Default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 15 * 60 * 1000;
  }
};

// Set auth cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const accessTokenMaxAge = parseDuration(env.JWT_EXPIRES_IN);
  const refreshTokenMaxAge = parseDuration(env.JWT_REFRESH_EXPIRES_IN);

  res.cookie('access_token', accessToken, getCookieOptions(accessTokenMaxAge));
  res.cookie('refresh_token', refreshToken, getCookieOptions(refreshTokenMaxAge));
};

// Clear auth cookies
const clearAuthCookies = (res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input with Zod
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message).join(', ');
      throw new AppError(`Validation failed: ${errors}`, 400);
    }

    const { email, phoneNumber, password, fullName, userType, preferredLanguage }: RegisterInput = validationResult.data;

    // Check if user already exists (case-insensitive email check)
    const existingUser = await query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1) OR phone_number = $2',
      [email, phoneNumber]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('User already exists with this email or phone number', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with transaction
    const result = await transaction(async (client) => {
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, phone_number, password_hash, full_name, user_type, preferred_language)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, phone_number, full_name, user_type, preferred_language, created_at`,
        [email, phoneNumber, passwordHash, fullName, userType, preferredLanguage || 'en']
      );

      const user = userResult.rows[0];

      // Create profile based on user type
      if (userType === 'customer') {
        await client.query(
          'INSERT INTO customer_profiles (user_id) VALUES ($1)',
          [user.id]
        );
      } else if (userType === 'seller') {
        await client.query(
          'INSERT INTO seller_profiles (user_id) VALUES ($1)',
          [user.id]
        );
      }

      return user;
    });

    // Generate tokens
    const accessToken = generateAccessToken(result.id, result.email, result.user_type);
    const refreshToken = generateRefreshToken(result.id);

    // Store refresh token in Redis
    const refreshTokenMaxAge = parseDuration(env.JWT_REFRESH_EXPIRES_IN) / 1000;
    await storeRefreshToken(result.id, refreshToken, refreshTokenMaxAge);

    // Set httpOnly cookies
    setAuthCookies(res, accessToken, refreshToken);

    logger.info(`User registered: ${result.email}`, { userId: result.id, requestId: req.id });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: result.id,
          email: result.email,
          phoneNumber: result.phone_number,
          fullName: result.full_name,
          userType: result.user_type,
          preferredLanguage: result.preferred_language,
        },
        // Also return token in body for backward compatibility (mobile apps, etc.)
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input with Zod
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message).join(', ');
      throw new AppError(`Validation failed: ${errors}`, 400);
    }

    const { email, password }: LoginInput = validationResult.data;

    // Get user (case-insensitive email)
    const result = await query(
      `SELECT id, email, phone_number, password_hash, full_name, user_type,
              preferred_language, is_active, is_verified
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      throw new AppError('Your account has been deactivated', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.user_type);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in Redis
    const refreshTokenMaxAge = parseDuration(env.JWT_REFRESH_EXPIRES_IN) / 1000;
    await storeRefreshToken(user.id, refreshToken, refreshTokenMaxAge);

    // Set httpOnly cookies
    setAuthCookies(res, accessToken, refreshToken);

    logger.info(`User logged in: ${user.email}`, { userId: user.id, requestId: req.id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          phoneNumber: user.phone_number,
          fullName: user.full_name,
          userType: user.user_type,
          preferredLanguage: user.preferred_language,
          isVerified: user.is_verified,
        },
        // Also return token in body for backward compatibility
        token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get tokens from cookies or headers
    const accessToken = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies?.refresh_token;

    if (accessToken) {
      // Blacklist the access token
      const accessTokenMaxAge = parseDuration(env.JWT_EXPIRES_IN) / 1000;
      await blacklistToken(accessToken, accessTokenMaxAge);
    }

    if (refreshToken && req.user?.id) {
      // Revoke the refresh token
      await revokeRefreshToken(req.user.id, refreshToken);
    }

    // Clear auth cookies
    clearAuthCookies(res);

    logger.info(`User logged out`, { userId: req.user?.id, requestId: req.id });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      `SELECT id, email, phone_number, full_name, user_type,
              preferred_language, is_verified, created_at
       FROM users
       WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = result.rows[0];

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phone_number,
        fullName: user.full_name,
        userType: user.user_type,
        preferredLanguage: user.preferred_language,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public (but requires valid refresh token)
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshTokenValue = req.cookies?.refresh_token || req.body.refreshToken;

    if (!refreshTokenValue) {
      throw new AppError('Refresh token is required', 401);
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshTokenValue, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    // Check if refresh token is still valid in Redis
    const isValid = await isRefreshTokenValid(decoded.id, refreshTokenValue);
    if (!isValid) {
      throw new AppError('Refresh token has been revoked', 401);
    }

    // Get user
    const result = await query(
      'SELECT id, email, user_type, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      throw new AppError('User not found or inactive', 401);
    }

    const user = result.rows[0];

    // Revoke old refresh token (rotation)
    await revokeRefreshToken(user.id, refreshTokenValue);

    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id, user.email, user.user_type);
    const newRefreshToken = generateRefreshToken(user.id);

    // Store new refresh token
    const refreshTokenMaxAge = parseDuration(env.JWT_REFRESH_EXPIRES_IN) / 1000;
    await storeRefreshToken(user.id, newRefreshToken, refreshTokenMaxAge);

    // Set new cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    logger.info(`Token refreshed for user`, { userId: user.id, requestId: req.id });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Please provide email', 400);
    }

    // Check if user exists
    const result = await query('SELECT id, email, full_name FROM users WHERE LOWER(email) = LOWER($1)', [email]);

    // Always return success message (don't reveal if email exists)
    const successResponse = {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    };

    if (result.rows.length === 0) {
      res.status(200).json(successResponse);
      return;
    }

    const user = result.rows[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store reset token in Redis with 1 hour expiration
    const expiresIn = env.PASSWORD_RESET_EXPIRES_IN / 1000; // Convert to seconds
    await storeResetToken(user.id, resetToken, expiresIn);

    // TODO: Send email with reset link
    // const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(user.email, user.full_name, resetUrl);

    logger.info(`Password reset requested for: ${user.email}`, { userId: user.id, requestId: req.id });

    res.status(200).json(successResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      throw new AppError('Reset token is required', 400);
    }

    if (!password || password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    // Validate password strength
    if (!/[A-Z]/.test(password)) {
      throw new AppError('Password must contain at least one uppercase letter', 400);
    }
    if (!/[0-9]/.test(password)) {
      throw new AppError('Password must contain at least one number', 400);
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new AppError('Password must contain at least one special character', 400);
    }

    // Get user ID from reset token
    const userId = await getResetTokenUserId(token);

    if (!userId) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );

    // Delete the reset token (one-time use)
    await deleteResetToken(token);

    // Revoke all refresh tokens for this user (force re-login on all devices)
    await revokeAllUserRefreshTokens(userId);

    logger.info(`Password reset successful`, { userId, requestId: req.id });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout from all devices
// @route   POST /api/v1/auth/logout-all
// @access  Private
export const logoutAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', 401);
    }

    // Revoke all refresh tokens for this user
    await revokeAllUserRefreshTokens(req.user.id);

    // Clear current session cookies
    clearAuthCookies(res);

    logger.info(`User logged out from all devices`, { userId: req.user.id, requestId: req.id });

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });
  } catch (error) {
    next(error);
  }
};

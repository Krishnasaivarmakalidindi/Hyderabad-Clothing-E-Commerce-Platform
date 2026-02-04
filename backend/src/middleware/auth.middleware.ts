import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';
import { query } from '../config/database.js';
import { isTokenBlacklisted } from '../config/redis.js';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        userType: 'customer' | 'seller' | 'admin';
    };
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        // Check for token in httpOnly cookie first (most secure)
        if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        }
        // Fallback to Authorization header (for mobile apps, API clients)
        else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError('Not authorized to access this route', 401);
        }

        // Check if token is blacklisted (logged out)
        try {
            const blacklisted = await isTokenBlacklisted(token);
            if (blacklisted) {
                throw new AppError('Token has been revoked', 401);
            }
        } catch (redisError) {
            // If Redis is unavailable, continue without blacklist check
            // Log the error but don't fail the request
            console.warn('Redis unavailable for token blacklist check');
        }

        // Verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            id: string;
            email: string;
            userType: string;
            type?: string;
        };

        // Ensure it's an access token, not a refresh token
        if (decoded.type && decoded.type !== 'access') {
            throw new AppError('Invalid token type', 401);
        }

        // Check if user still exists
        const result = await query(
            'SELECT id, email, user_type, is_active FROM users WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        const user = result.rows[0];

        if (!user.is_active) {
            throw new AppError('User account is deactivated', 401);
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            userType: user.user_type,
        };

        next();
    } catch (error: any) {
        // Handle JWT-specific errors
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired', 401));
        }
        next(error);
    }
};

// Restrict to specific user types
export const restrictTo = (...userTypes: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !userTypes.includes(req.user.userType)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};

// Optional auth - attaches user if token present, but doesn't require it
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        } else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(); // No token, continue without user
        }

        // Check blacklist
        try {
            const blacklisted = await isTokenBlacklisted(token);
            if (blacklisted) {
                return next(); // Token blacklisted, continue without user
            }
        } catch (redisError) {
            // Continue if Redis unavailable
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            id: string;
            email: string;
            userType: string;
        };

        const result = await query(
            'SELECT id, email, user_type, is_active FROM users WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length > 0 && result.rows[0].is_active) {
            req.user = {
                id: result.rows[0].id,
                email: result.rows[0].email,
                userType: result.rows[0].user_type,
            };
        }

        next();
    } catch (error) {
        // For optional auth, just continue without user
        next();
    }
};

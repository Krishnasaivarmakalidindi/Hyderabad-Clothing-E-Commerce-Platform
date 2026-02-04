import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Validation schemas for auth endpoints
 */

// Email validation
const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim();

// Phone number validation (Indian format)
const phoneNumberSchema = z
    .string()
    .min(1, 'Phone number is required')
    .regex(
        /^(\+91)?[6-9]\d{9}$/,
        'Invalid phone number. Must be a valid Indian mobile number (e.g., +919876543210 or 9876543210)'
    );

// Password validation with strength requirements
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// User type validation
const userTypeSchema = z.enum(['customer', 'seller'], {
    errorMap: () => ({ message: 'User type must be either "customer" or "seller"' }),
});

// Language preference
const languageSchema = z.enum(['en', 'te']).default('en');

/**
 * Registration schema
 */
export const registerSchema = z.object({
    email: emailSchema,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters')
        .trim(),
    userType: userTypeSchema,
    preferredLanguage: languageSchema.optional(),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters')
        .trim()
        .optional(),
    phoneNumber: phoneNumberSchema.optional(),
    preferredLanguage: languageSchema.optional(),
});

/**
 * Type exports for use in controllers
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Middleware factory for validating request body against a Zod schema
 */
export function validate<T>(schema: z.ZodSchema<T>) {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                const errors = result.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                throw new AppError(
                    `Validation failed: ${errors.map((e) => e.message).join(', ')}`,
                    400
                );
            }

            // Replace body with validated and transformed data
            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .trim();
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Product validation schemas
 */
export const productQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    category: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    search: z.string().max(100).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).optional(),
});

/**
 * Order validation schemas
 */
export const createOrderSchema = z.object({
    variantId: z.string().uuid('Invalid variant ID'),
    quantity: z.coerce.number().int().positive().max(10, 'Maximum 10 items per order'),
    deliveryAddressId: z.string().uuid('Invalid delivery address ID'),
    paymentMethod: z.enum(['cod', 'online', 'upi'], {
        errorMap: () => ({ message: 'Payment method must be cod, online, or upi' }),
    }),
});

/**
 * Address validation schema
 */
export const addressSchema = z.object({
    addressLine1: z.string().min(5, 'Address must be at least 5 characters').max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(2, 'City must be at least 2 characters').max(100),
    state: z.string().min(2, 'State must be at least 2 characters').max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    landmark: z.string().max(100).optional(),
    isDefault: z.boolean().default(false),
});

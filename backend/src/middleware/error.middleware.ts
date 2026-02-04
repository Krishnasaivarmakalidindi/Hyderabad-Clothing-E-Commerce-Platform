import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

// Error codes for client-side handling
export const ErrorCodes = {
    // Authentication
    AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
    AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
    AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
    AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    AUTH_USER_DEACTIVATED: 'AUTH_USER_DEACTIVATED',

    // Validation
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    INVALID_INPUT: 'INVALID_INPUT',

    // Resources
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
    ADDRESS_NOT_FOUND: 'ADDRESS_NOT_FOUND',

    // Order
    INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
    ORDER_CANNOT_CANCEL: 'ORDER_CANNOT_CANCEL',
    INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',

    // Rate limiting
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

    // CSRF
    CSRF_INVALID: 'CSRF_INVALID',

    // Server
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

interface ErrorResponse {
    success: false;
    code: ErrorCode;
    message: string;
    errors?: any;
    requestId?: string;
    stack?: string;
}

export class AppError extends Error {
    statusCode: number;
    code: ErrorCode;
    isOperational: boolean;

    constructor(message: string, statusCode: number, code?: ErrorCode) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || mapStatusToCode(statusCode);
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Map HTTP status codes to error codes
function mapStatusToCode(statusCode: number): ErrorCode {
    switch (statusCode) {
        case 400: return ErrorCodes.INVALID_INPUT;
        case 401: return ErrorCodes.AUTH_UNAUTHORIZED;
        case 403: return ErrorCodes.AUTH_FORBIDDEN;
        case 404: return ErrorCodes.RESOURCE_NOT_FOUND;
        case 409: return ErrorCodes.DUPLICATE_ENTRY;
        case 429: return ErrorCodes.RATE_LIMIT_EXCEEDED;
        default: return ErrorCodes.INTERNAL_ERROR;
    }
}

// Map error messages to specific codes
function getErrorCode(err: Error | AppError, message: string): ErrorCode {
    if (err instanceof AppError && err.code) {
        return err.code;
    }

    const lowerMessage = message.toLowerCase();

    // Authentication errors
    if (lowerMessage.includes('invalid token') || err?.name === 'JsonWebTokenError') {
        return ErrorCodes.AUTH_INVALID_TOKEN;
    }
    if (lowerMessage.includes('token expired') || err?.name === 'TokenExpiredError') {
        return ErrorCodes.AUTH_TOKEN_EXPIRED;
    }
    if (lowerMessage.includes('invalid credentials')) {
        return ErrorCodes.AUTH_INVALID_CREDENTIALS;
    }
    if (lowerMessage.includes('deactivated')) {
        return ErrorCodes.AUTH_USER_DEACTIVATED;
    }
    if (lowerMessage.includes('user not found')) {
        return ErrorCodes.AUTH_USER_NOT_FOUND;
    }

    // Validation errors
    if (lowerMessage.includes('validation failed') || err?.name === 'ValidationError') {
        return ErrorCodes.VALIDATION_FAILED;
    }
    if (lowerMessage.includes('duplicate')) {
        return ErrorCodes.DUPLICATE_ENTRY;
    }

    // Resource errors
    if (lowerMessage.includes('product') && lowerMessage.includes('not found')) {
        return ErrorCodes.PRODUCT_NOT_FOUND;
    }
    if (lowerMessage.includes('order') && lowerMessage.includes('not found')) {
        return ErrorCodes.ORDER_NOT_FOUND;
    }
    if (lowerMessage.includes('not found')) {
        return ErrorCodes.RESOURCE_NOT_FOUND;
    }

    // Stock errors
    if (lowerMessage.includes('insufficient stock') || lowerMessage.includes('out of stock')) {
        return ErrorCodes.INSUFFICIENT_STOCK;
    }

    return ErrorCodes.INTERNAL_ERROR;
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Default error
        let statusCode = 500;
        let message = 'Internal Server Error';

        // Custom AppError
        if (err instanceof AppError) {
            statusCode = err.statusCode;
            message = err.message;
        }

        // Mongoose/PostgreSQL duplicate key error
        if (err?.message?.includes?.('duplicate key')) {
            statusCode = 409;
            message = 'Duplicate field value entered';
        }

        // JWT errors
        if (err?.name === 'JsonWebTokenError') {
            statusCode = 401;
            message = 'Invalid token';
        }

        if (err?.name === 'TokenExpiredError') {
            statusCode = 401;
            message = 'Token expired';
        }

        // Validation errors
        if (err?.name === 'ValidationError') {
            statusCode = 400;
            message = 'Validation failed';
        }

        // Get error code
        const code = getErrorCode(err, message);

        // Log error with context
        const logContext = {
            requestId: req.id,
            method: req.method,
            path: req.path,
            statusCode,
            code,
            userId: (req as any).user?.id,
        };

        if (statusCode >= 500) {
            logger.error(message, { ...logContext, stack: err?.stack });
        } else if (statusCode >= 400) {
            logger.warn(message, logContext);
        }

        const response: ErrorResponse = {
            success: false,
            code,
            message,
            requestId: req.id,
        };

        // Include stack trace in development
        if (env.NODE_ENV === 'development') {
            response.stack = err?.stack || String(err);
        }

        res.status(statusCode).json(response);
    } catch (handlerErr) {
        logger.error('Error handler crashed', { error: handlerErr });
        res.status(500).json({
            success: false,
            code: ErrorCodes.INTERNAL_ERROR,
            message: 'Internal Server Error',
        });
    }
};

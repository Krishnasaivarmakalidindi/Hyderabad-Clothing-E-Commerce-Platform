import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Required environment variables for the application to function
const REQUIRED_ENV_VARS = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
] as const;

// Optional but recommended for production
const PRODUCTION_REQUIRED_ENV_VARS = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'SENDGRID_API_KEY',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
] as const;

interface EnvConfig {
    // Server
    NODE_ENV: string;
    PORT: number;
    API_VERSION: string;

    // Database
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;

    // Redis
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;

    // JWT
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;

    // Razorpay
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    RAZORPAY_WEBHOOK_SECRET: string;

    // Twilio
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_WHATSAPP_NUMBER: string;

    // SendGrid
    SENDGRID_API_KEY: string;
    SENDGRID_FROM_EMAIL: string;
    SENDGRID_FROM_NAME: string;

    // AWS
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_S3_BUCKET: string;

    // Shiprocket
    SHIPROCKET_EMAIL: string;
    SHIPROCKET_PASSWORD: string;
    SHIPROCKET_API_URL: string;

    // Frontend
    FRONTEND_URL: string;
    ALLOWED_ORIGINS: string[];

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;

    // Security
    BCRYPT_SALT_ROUNDS: number;
    COOKIE_SECRET: string;
    COOKIE_DOMAIN: string;

    // Password Reset
    PASSWORD_RESET_EXPIRES_IN: number;

    // File Upload
    MAX_FILE_SIZE: number;
    ALLOWED_FILE_TYPES: string[];

    // Business Logic
    DEFAULT_COMMISSION_RATE: number;
    SELLER_PAYOUT_CYCLE_DAYS: number;
    FRAUD_DETECTION_THRESHOLD: number;
    MAX_RETURN_RATE_THRESHOLD: number;
}

/**
 * Validates that all required environment variables are set
 * Throws an error if any required variable is missing
 */
export function validateEnv(): void {
    const missingVars: string[] = [];

    for (const varName of REQUIRED_ENV_VARS) {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env file.`
        );
    }

    // Warn about missing production variables
    if (process.env.NODE_ENV === 'production') {
        const missingProdVars: string[] = [];

        for (const varName of PRODUCTION_REQUIRED_ENV_VARS) {
            if (!process.env[varName]) {
                missingProdVars.push(varName);
            }
        }

        if (missingProdVars.length > 0) {
            console.warn(
                `⚠️  Missing recommended production environment variables:\n${missingProdVars.map(v => `  - ${v}`).join('\n')}`
            );
        }
    }

    console.log('✅ Environment variables validated successfully');
}

/**
 * Parse and return typed environment configuration
 */
export function getEnvConfig(): EnvConfig {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean);

    const allowedFileTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp')
        .split(',')
        .map(type => type.trim())
        .filter(Boolean);

    return {
        // Server
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: parseInt(process.env.PORT || '5000', 10),
        API_VERSION: process.env.API_VERSION || 'v1',

        // Database
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
        DB_NAME: process.env.DB_NAME || 'hyderabad_clothing',
        DB_USER: process.env.DB_USER || 'postgres',
        DB_PASSWORD: process.env.DB_PASSWORD || '',

        // Redis
        REDIS_HOST: process.env.REDIS_HOST || 'localhost',
        REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
        REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

        // JWT
        JWT_SECRET: process.env.JWT_SECRET || '',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

        // Razorpay
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
        RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',

        // Twilio
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
        TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER || '',

        // SendGrid
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
        SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'noreply@hyderabadclothing.com',
        SENDGRID_FROM_NAME: process.env.SENDGRID_FROM_NAME || 'Hyderabad Clothing',

        // AWS
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
        AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'hyderabad-clothing-images',

        // Shiprocket
        SHIPROCKET_EMAIL: process.env.SHIPROCKET_EMAIL || '',
        SHIPROCKET_PASSWORD: process.env.SHIPROCKET_PASSWORD || '',
        SHIPROCKET_API_URL: process.env.SHIPROCKET_API_URL || 'https://apiv2.shiprocket.in/v1/external',

        // Frontend
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
        ALLOWED_ORIGINS: allowedOrigins,

        // Rate Limiting
        RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

        // Security
        BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
        COOKIE_SECRET: process.env.COOKIE_SECRET || 'dev_cookie_secret_32chars_min!!',
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',

        // Password Reset
        PASSWORD_RESET_EXPIRES_IN: parseInt(process.env.PASSWORD_RESET_EXPIRES_IN || '3600000', 10),

        // File Upload
        MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
        ALLOWED_FILE_TYPES: allowedFileTypes,

        // Business Logic
        DEFAULT_COMMISSION_RATE: parseFloat(process.env.DEFAULT_COMMISSION_RATE || '0.07'),
        SELLER_PAYOUT_CYCLE_DAYS: parseInt(process.env.SELLER_PAYOUT_CYCLE_DAYS || '7', 10),
        FRAUD_DETECTION_THRESHOLD: parseFloat(process.env.FRAUD_DETECTION_THRESHOLD || '0.70'),
        MAX_RETURN_RATE_THRESHOLD: parseFloat(process.env.MAX_RETURN_RATE_THRESHOLD || '0.80'),
    };
}

// Export singleton config
export const env = getEnvConfig();

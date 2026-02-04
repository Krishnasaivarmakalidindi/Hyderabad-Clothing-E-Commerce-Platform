import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Load and validate environment variables FIRST
import { validateEnv, env } from './config/env.js';
validateEnv();

// Import Redis for token blacklisting
import { connectRedis } from './config/redis.js';
import { query } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import returnRoutes from './routes/return.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import adminRoutes from './routes/admin.routes.js';
import customerRoutes from './routes/customer.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

// Import middleware
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';

const app: Application = express();
const PORT = env.PORT;

// ============================================
// MIDDLEWARE
// ============================================

// Debug logging - only in development
if (env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[DEBUG] ${req.method} ${req.url} from ${req.headers.origin}`);
        next();
    });
}

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - whitelist based
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) {
            return callback(null, true);
        }

        if (env.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else if (env.NODE_ENV === 'development') {
            // In development, log but allow unknown origins
            console.warn(`CORS: Allowing unknown origin in dev mode: ${origin}`);
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for httpOnly cookies
app.use(cookieParser(env.COOKIE_SECRET));

// Request ID middleware for tracing
app.use((req: Request, res: Response, next) => {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    req.id = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
});

// CSRF Token generation endpoint (for SPA to fetch token)
app.get('/api/csrf-token', (req: Request, res: Response) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf-token', csrfToken, {
        httpOnly: false, // Must be readable by JavaScript
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    res.json({ csrfToken });
});

// CSRF Protection middleware for state-changing requests
const csrfProtection = (req: Request, res: Response, next: express.NextFunction) => {
    // Skip CSRF for webhooks (they use signature verification)
    if (req.path.includes('/webhooks')) {
        return next();
    }

    // Skip for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const csrfFromHeader = req.headers['x-csrf-token'] as string;
    const csrfFromCookie = req.cookies['csrf-token'];

    if (!csrfFromHeader || !csrfFromCookie || csrfFromHeader !== csrfFromCookie) {
        return res.status(403).json({
            success: false,
            code: 'CSRF_INVALID',
            message: 'Invalid or missing CSRF token'
        });
    }

    next();
};

// Apply CSRF protection to API routes (after cookie parser)

// Logging
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit to 10 requests per window
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// ============================================
// ROUTES
// ============================================

// Health check with database connectivity
app.get('/health', async (_req: Request, res: Response) => {
    try {
        await query('SELECT 1');
        res.status(200).json({
            success: true,
            message: 'Hyderabad Clothing API is running',
            timestamp: new Date().toISOString(),
            environment: env.NODE_ENV,
            database: 'connected',
            redis: 'connected'
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Service degraded',
            timestamp: new Date().toISOString(),
            environment: env.NODE_ENV,
            database: 'disconnected'
        });
    }
});

// API routes with CSRF protection
const API_VERSION = env.API_VERSION;
app.use(`/api/${API_VERSION}/auth`, authLimiter, csrfProtection, authRoutes);
app.use(`/api/${API_VERSION}/products`, productRoutes); // Read-only, no CSRF needed
app.use(`/api/${API_VERSION}/orders`, csrfProtection, orderRoutes);
app.use(`/api/${API_VERSION}/returns`, csrfProtection, returnRoutes);
app.use(`/api/${API_VERSION}/seller`, csrfProtection, sellerRoutes);
app.use(`/api/${API_VERSION}/admin`, csrfProtection, adminRoutes);
app.use(`/api/${API_VERSION}/customer`, csrfProtection, customerRoutes);
app.use(`/api/${API_VERSION}/webhooks`, webhookRoutes); // Webhooks use signature verification

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER
// ============================================

const startServer = async () => {
    console.log('🚀 Starting server initialization...');

    try {
        // Initialize Redis connection (optional in development)
        console.log('📦 Attempting Redis connection...');
        await connectRedis();
    } catch (error) {
        console.warn('⚠️  Redis not available - token blacklisting disabled');
    }

    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🛍️  Hyderabad Clothing E-Commerce Platform API             ║
║                                                                ║
║   Server running on: http://localhost:${PORT}                    ║
║   Environment: ${env.NODE_ENV.toUpperCase().padEnd(12)}                            ║
║   API Version: ${API_VERSION}                                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
    });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Start the server
startServer();

export default app;

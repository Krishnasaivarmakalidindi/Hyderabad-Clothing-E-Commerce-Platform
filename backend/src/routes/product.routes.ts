import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
    getAllProducts,
    getProductById,
    getSizeRecommendation,
    askSeller,
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Rate limiter for search (expensive ILIKE queries)
const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: {
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many search requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public routes
router.get('/', searchLimiter, getAllProducts);
router.get('/:id', getProductById);
router.get('/:id/size-recommendation', getSizeRecommendation);

// Protected routes
router.post('/:id/ask-seller', protect, askSeller);

export default router;

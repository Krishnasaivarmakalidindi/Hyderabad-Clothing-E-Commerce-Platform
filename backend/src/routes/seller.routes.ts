import { Router } from 'express';
import {
    getSellerDashboard,
    getSellerOrders,
    getSellerOrderById,
    createProduct,
    getSellerProducts,
    updateProduct,
    getEarnings,
    getNextPayout,
    generateShippingLabel,
} from '../controllers/seller.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected (seller only)
router.use(protect);
router.use(restrictTo('seller'));

router.get('/dashboard', getSellerDashboard);
router.get('/orders', getSellerOrders);
router.get('/orders/:id', getSellerOrderById);

router.post('/products', createProduct);
router.get('/products', getSellerProducts);
router.put('/products/:id', updateProduct);

router.get('/earnings', getEarnings);
router.get('/earnings/next-payout', getNextPayout);

router.post('/shipping-label/:orderId', generateShippingLabel);

export default router;

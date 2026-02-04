import { Router } from 'express';
import {
    getAdminDashboard,
    getReturnsQueue,
    approveReturn,
    rejectReturn,
    getDisputesQueue,
    resolveDispute,
    getSellersOnboarding,
    verifySeller,
    getFraudDashboard,
    schedulePayouts,
    getAnalytics,
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard', getAdminDashboard);

// Returns management
router.get('/returns/queue', getReturnsQueue);
router.post('/returns/:id/approve', approveReturn);
router.post('/returns/:id/reject', rejectReturn);

// Disputes
router.get('/disputes/queue', getDisputesQueue);
router.post('/disputes/:id/decide', resolveDispute);

// Seller management
router.get('/sellers/onboarding', getSellersOnboarding);
router.post('/sellers/:id/verify', verifySeller);

// Fraud detection
router.get('/fraud/dashboard', getFraudDashboard);

// Payouts
router.post('/payouts/schedule', schedulePayouts);

// Analytics
router.get('/analytics/metrics', getAnalytics);

export default router;

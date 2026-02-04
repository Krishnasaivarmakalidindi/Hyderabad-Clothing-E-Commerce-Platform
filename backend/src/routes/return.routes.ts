import { Router } from 'express';
import {
    createReturn,
    getReturnById,
    getMyReturns,
    cancelReturn,
} from '../controllers/return.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected (customer only)
router.use(protect);
router.use(restrictTo('customer'));

router.post('/', createReturn);
router.get('/', getMyReturns);
router.get('/:id', getReturnById);
router.patch('/:id/cancel', cancelReturn);

export default router;

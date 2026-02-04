import { Router } from 'express';
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    updateSizeData,
    getProfile,
} from '../controllers/customer.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// All routes are protected (customer only)
router.use(protect);
router.use(restrictTo('customer'));

// Cart
router.post('/cart', addToCart);
router.get('/cart', getCart);
router.put('/cart/:itemId', updateCartQuantity);
router.delete('/cart/:itemId', removeFromCart);
router.delete('/cart', clearCart);

// Profile
router.get('/profile', getProfile);
router.put('/profile/size-data', updateSizeData);

// Addresses
import {
    getAddresses,
    addAddress,
    deleteAddress,
} from '../controllers/customer.controller.js';

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;

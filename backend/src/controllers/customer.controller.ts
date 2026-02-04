import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware.js';
import { query } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { env } from '../config/env.js';

// Cart operations use database directly - no in-memory fallback in production

// Placeholder controllers for customer routes

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { productId, size, quantity = 1 } = req.body;

        if (!productId) {
            throw new AppError('Product ID is required', 400);
        }

        const parsedQty = Number(quantity);
        if (!Number.isInteger(parsedQty) || parsedQty <= 0 || parsedQty > 10) {
            throw new AppError('Quantity must be a positive integer (max 10)', 400);
        }

        // Check if product exists
        const productResult = await query(
            'SELECT id, name_en, price, images FROM products WHERE id = $1 AND status = $2',
            [productId, 'active']
        );

        if (productResult.rows.length === 0) {
            throw new AppError('Product not found or unavailable', 404);
        }

        const product = productResult.rows[0];
        const itemSize = size || 'Free Size';

        // Check if item already in cart with same size
        const existingItem = await query(
            'SELECT * FROM carts WHERE customer_id = $1 AND product_id = $2 AND size = $3',
            [customerId, productId, itemSize]
        );

        let result;
        if (existingItem.rows.length > 0) {
            // Update quantity
            const newQuantity = Math.min(existingItem.rows[0].quantity + parsedQty, 10);
            result = await query(
                'UPDATE carts SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
                [newQuantity, existingItem.rows[0].id]
            );
        } else {
            // Insert new item
            result = await query(
                `INSERT INTO carts (customer_id, product_id, variant_id, quantity, size)
                 VALUES ($1, $2, NULL, $3, $4) RETURNING *`,
                [customerId, productId, parsedQty, itemSize]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;

        const result = await query(
            `SELECT c.id, c.quantity, c.product_id, c.size,
                    p.name_en as product_name, p.price, p.images
             FROM carts c
             JOIN products p ON c.product_id = p.id
             WHERE c.customer_id = $1
             ORDER BY c.added_at DESC`,
            [customerId]
        );

        // Calculate totals
        let subtotal = 0;
        const items = result.rows.map(item => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            subtotal += itemTotal;
            return {
                ...item,
                total: itemTotal
            };
        });

        res.status(200).json({
            success: true,
            data: {
                items,
                subtotal,
                count: items.length
            }
        });
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { itemId } = req.params;

        const result = await query(
            'DELETE FROM carts WHERE id = $1 AND customer_id = $2 RETURNING *',
            [itemId, customerId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Cart item not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        next(error);
    }
};

export const updateCartQuantity = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const parsedQty = Number(quantity);
        if (!Number.isInteger(parsedQty) || parsedQty <= 0 || parsedQty > 10) {
            throw new AppError('Quantity must be a positive integer (max 10)', 400);
        }

        const result = await query(
            'UPDATE carts SET quantity = $1, updated_at = NOW() WHERE id = $2 AND customer_id = $3 RETURNING *',
            [parsedQty, itemId, customerId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Cart item not found', 404);
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        await query('DELETE FROM carts WHERE customer_id = $1', [customerId]);
        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};

export const updateSizeData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ success: false, message: 'Not implemented yet' });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        // Get customer profile
        const profileResult = await query(
            'SELECT * FROM customer_profiles WHERE user_id = $1',
            [userId]
        );

        // If no profile exists, create one
        if (profileResult.rows.length === 0) {
            await query(
                'INSERT INTO customer_profiles (user_id) VALUES ($1)',
                [userId]
            );
        }

        const result = await query(
            `SELECT u.id, u.full_name, u.email, u.phone_number, u.user_type, 
                    cp.total_orders, cp.total_spent, cp.return_count
             FROM users u
             LEFT JOIN customer_profiles cp ON u.id = cp.user_id
             WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const result = await query(
            'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
            [userId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { fullName, phoneNumber, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = req.body;

        if (!fullName || !phoneNumber || !addressLine1 || !city || !state || !pincode) {
            throw new AppError('Please provide all required fields', 400);
        }

        // If this is the first address or set as default, update other addresses
        if (isDefault) {
            await query(
                'UPDATE addresses SET is_default = false WHERE user_id = $1',
                [userId]
            );
        }

        // Check if it's the first address, make it default automatically
        const countResult = await query('SELECT count(*) FROM addresses WHERE user_id = $1', [userId]);
        const isFirst = parseInt(countResult.rows[0].count) === 0;
        const shouldBeDefault = isDefault || isFirst;

        const result = await query(
            `INSERT INTO addresses 
            (user_id, full_name, phone_number, address_line1, address_line2, landmark, city, state, pincode, is_default)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [userId, fullName, phoneNumber, addressLine1, addressLine2, landmark, city, state, pincode, shouldBeDefault]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const addressId = req.params.id;

        const result = await query(
            'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *',
            [addressId, userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Address not found or not authorized', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

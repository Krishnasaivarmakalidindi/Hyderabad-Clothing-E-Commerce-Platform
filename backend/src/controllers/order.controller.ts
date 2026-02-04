import { Request, Response, NextFunction } from 'express';
import { query, transaction } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { v4 as uuidv4 } from 'uuid';

// Generate unique order number
const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `HYD${timestamp}${random}`;
};

// @desc    Create a new order
// @route   POST /api/v1/orders
// @access  Private (Customer)
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        // Input is already validated by Zod middleware
        const { variantId, quantity, deliveryAddressId, paymentMethod } = req.body;

        const parsedQuantity = quantity;

        const parseOrDefault = (value: any, fallback = 0) => {
            const numeric = Number(value);
            return Number.isFinite(numeric) ? numeric : fallback;
        };

        // Create order in a transaction
        const orderResult = await transaction(async (client) => {
            // Get product variant details
            const variantResult = await client.query(
                `
        SELECT 
          pv.id, pv.product_id, pv.size, pv.stock_available,
          p.seller_id, p.price, p.commission_rate, p.tax_rate, p.base_shipping_cost
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE pv.id = $1 AND pv.is_available = true
        `,
                [variantId]
            );

            if (variantResult.rows.length === 0) {
                throw new AppError('Product variant not found or unavailable', 404);
            }

            const variant = variantResult.rows[0];

            // Check stock availability
            if (variant.stock_available < parsedQuantity) {
                throw new AppError('Insufficient stock available', 400);
            }

            // Calculate pricing
            const unitPrice = parseOrDefault(variant.price);
            const taxRate = parseOrDefault(variant.tax_rate);
            const shippingCost = parseOrDefault(variant.base_shipping_cost);
            const commissionRate = parseOrDefault(variant.commission_rate);

            const subtotal = unitPrice * parsedQuantity;
            const taxAmount = subtotal * taxRate;
            const totalAmount = subtotal + taxAmount + shippingCost;
            const commissionAmount = subtotal * commissionRate;
            const sellerPayoutAmount = subtotal - commissionAmount;

            const orderNumber = generateOrderNumber();

            // Calculate return window (7 days from delivery)
            const returnWindowEndDate = new Date();
            returnWindowEndDate.setDate(returnWindowEndDate.getDate() + 14);

            // Insert order
            const orderInsert = await client.query(
                `
        INSERT INTO orders (
          order_number, customer_id, seller_id, product_id, variant_id,
          quantity, unit_price, subtotal, tax_amount, shipping_cost,
          total_amount, commission_amount, seller_payout_amount,
          payment_method, delivery_address_id, return_window_end_date,
          status, payment_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
        `,
                [
                    orderNumber, customerId, variant.seller_id, variant.product_id, variantId,
                    parsedQuantity, unitPrice, subtotal, taxAmount, shippingCost,
                    totalAmount, commissionAmount, sellerPayoutAmount,
                    paymentMethod, deliveryAddressId, returnWindowEndDate,
                    'pending', 'pending'
                ]
            );

            // Reserve stock - decrement available and increment reserved
            await client.query(
                `
        UPDATE product_variants
        SET stock_available = stock_available - $1,
            stock_reserved = stock_reserved + $1
        WHERE id = $2 AND stock_available >= $1
        `,
                [parsedQuantity, variantId]
            );

            // Verify stock was actually updated (in case of race condition)
            const stockCheck = await client.query(
                'SELECT stock_available FROM product_variants WHERE id = $1',
                [variantId]
            );

            if (stockCheck.rows[0].stock_available < 0) {
                throw new AppError('Insufficient stock available (concurrent order)', 409);
            }

            // Add order status history
            await client.query(
                `
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES ($1, $2, $3)
        `,
                [orderInsert.rows[0].id, 'pending', 'Order created']
            );

            return orderInsert.rows[0];
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: orderResult,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get customer's orders
// @route   GET /api/v1/orders
// @access  Private (Customer)
export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { status, page = 1, limit = 10 } = req.query;

        let queryText = `
      SELECT 
        o.*,
        p.name_en as product_name,
        p.images as product_images,
        pv.size,
        u.full_name as seller_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN product_variants pv ON o.variant_id = pv.id
      JOIN users u ON o.seller_id = u.id
      WHERE o.customer_id = $1
    `;

        const params: any[] = [customerId];
        let paramIndex = 2;

        if (status) {
            queryText += ` AND o.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        queryText += `
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

        params.push(Number(limit));
        params.push((Number(page) - 1) * Number(limit));

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query(
            'SELECT COUNT(*) FROM orders WHERE customer_id = $1',
            [customerId]
        );
        const totalOrders = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                orders: result.rows,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalOrders,
                    totalPages: Math.ceil(totalOrders / Number(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private (Customer)
export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { id } = req.params;

        const result = await query(
            `
      SELECT 
        o.*,
        p.name_en as product_name,
        p.name_te as product_name_te,
        p.images as product_images,
        pv.size,
        u.full_name as seller_name,
        u.phone_number as seller_phone,
        a.address_line1, a.address_line2, a.city, a.state, a.pincode,
        COALESCE(
          json_agg(
            json_build_object(
              'status', osh.status,
              'notes', osh.notes,
              'created_at', osh.created_at
            ) ORDER BY osh.created_at DESC
          ) FILTER (WHERE osh.id IS NOT NULL), '[]'
        ) as status_history
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN product_variants pv ON o.variant_id = pv.id
      JOIN users u ON o.seller_id = u.id
      LEFT JOIN addresses a ON o.delivery_address_id = a.id
      LEFT JOIN order_status_history osh ON o.id = osh.order_id
      WHERE o.id = $1 AND o.customer_id = $2
      GROUP BY o.id, p.name_en, p.name_te, p.images, pv.size, u.full_name, 
               u.phone_number, a.address_line1, a.address_line2, a.city, a.state, a.pincode
      `,
            [id, customerId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Order not found', 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel an order
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { id } = req.params;
        const { reason } = req.body;

        // Get order details
        const orderResult = await query(
            'SELECT * FROM orders WHERE id = $1 AND customer_id = $2',
            [id, customerId]
        );

        if (orderResult.rows.length === 0) {
            throw new AppError('Order not found', 404);
        }

        const order = orderResult.rows[0];

        // Check if order can be cancelled
        if (!['pending', 'payment_pending', 'confirmed'].includes(order.status)) {
            throw new AppError('This order cannot be cancelled at this stage', 400);
        }

        await transaction(async (client) => {
            // Update order status
            await client.query(
                `
        UPDATE orders 
        SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
                [id]
            );

            // Release reserved stock back to available
            await client.query(
                `
        UPDATE product_variants
        SET stock_reserved = stock_reserved - $1,
            stock_available = stock_available + $1
        WHERE id = $2
        `,
                [order.quantity, order.variant_id]
            );

            // Add to status history
            await client.query(
                `
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES ($1, 'cancelled', $2)
        `,
                [id, reason || 'Cancelled by customer']
            );
        });

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
        });
    } catch (error) {
        next(error);
    }
};

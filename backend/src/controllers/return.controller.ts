import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { query, transaction } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Valid return reasons
const VALID_RETURN_REASONS = [
    'wrong_size',
    'damaged',
    'not_as_described',
    'changed_mind',
    'quality_issue',
    'wrong_item',
    'other'
] as const;

type ReturnReason = typeof VALID_RETURN_REASONS[number];

// Valid return types
const VALID_RETURN_TYPES = ['return', 'exchange'] as const;
type ReturnType = typeof VALID_RETURN_TYPES[number];

/**
 * @desc    Create a return/exchange request
 * @route   POST /api/v1/returns
 * @access  Private (Customer)
 */
export const createReturn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const {
            orderId,
            returnType = 'return',
            reason,
            description,
            exchangeVariantId
        } = req.body;

        // Validate required fields
        if (!orderId || !reason) {
            throw new AppError('Order ID and reason are required', 400);
        }

        // Validate return reason
        if (!VALID_RETURN_REASONS.includes(reason as ReturnReason)) {
            throw new AppError(`Invalid return reason. Must be one of: ${VALID_RETURN_REASONS.join(', ')}`, 400);
        }

        // Validate return type
        if (!VALID_RETURN_TYPES.includes(returnType as ReturnType)) {
            throw new AppError('Return type must be "return" or "exchange"', 400);
        }

        // If exchange, variant ID is required
        if (returnType === 'exchange' && !exchangeVariantId) {
            throw new AppError('Exchange variant ID is required for exchanges', 400);
        }

        // Get order details
        const orderResult = await query(
            `SELECT o.*, p.name_en as product_name
             FROM orders o
             JOIN products p ON o.product_id = p.id
             WHERE o.id = $1 AND o.customer_id = $2`,
            [orderId, customerId]
        );

        if (orderResult.rows.length === 0) {
            throw new AppError('Order not found', 404);
        }

        const order = orderResult.rows[0];

        // Check if order is eligible for return
        if (!['delivered', 'completed'].includes(order.status)) {
            throw new AppError('Only delivered orders can be returned', 400);
        }

        // Check return window
        const returnWindowEnd = new Date(order.return_window_end_date);
        if (new Date() > returnWindowEnd) {
            throw new AppError('Return window has expired for this order', 400);
        }

        // Check if return already exists for this order
        const existingReturn = await query(
            `SELECT id FROM returns WHERE order_id = $1 AND status NOT IN ('cancelled', 'rejected')`,
            [orderId]
        );

        if (existingReturn.rows.length > 0) {
            throw new AppError('A return request already exists for this order', 400);
        }

        // Create return request in transaction
        const returnResult = await transaction(async (client) => {
            // Generate return number
            const returnNumber = `RET${Date.now().toString(36).toUpperCase()}`;

            // Insert return request
            const insertResult = await client.query(
                `INSERT INTO returns (
                    return_number, order_id, customer_id, seller_id, product_id, variant_id,
                    return_type, reason, customer_description, quantity, refund_amount,
                    status, requested_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
                RETURNING *`,
                [
                    returnNumber,
                    orderId,
                    customerId,
                    order.seller_id,
                    order.product_id,
                    order.variant_id,
                    returnType,
                    reason,
                    description || null,
                    order.quantity,
                    returnType === 'return' ? order.total_amount : 0,
                    'requested'
                ]
            );

            // Update order status
            await client.query(
                `UPDATE orders SET status = 'return_requested', updated_at = NOW() WHERE id = $1`,
                [orderId]
            );

            // If exchange, store the exchange variant
            if (returnType === 'exchange' && exchangeVariantId) {
                await client.query(
                    `UPDATE returns SET exchange_variant_id = $1 WHERE id = $2`,
                    [exchangeVariantId, insertResult.rows[0].id]
                );
            }

            return insertResult.rows[0];
        });

        res.status(201).json({
            success: true,
            message: `${returnType === 'exchange' ? 'Exchange' : 'Return'} request created successfully`,
            data: returnResult
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get return by ID
 * @route   GET /api/v1/returns/:id
 * @access  Private (Customer)
 */
export const getReturnById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { id } = req.params;

        const result = await query(
            `SELECT r.*,
                    o.order_number, o.total_amount as order_total,
                    p.name_en as product_name, p.images as product_images,
                    pv.size,
                    u.full_name as seller_name
             FROM returns r
             JOIN orders o ON r.order_id = o.id
             JOIN products p ON r.product_id = p.id
             LEFT JOIN product_variants pv ON r.variant_id = pv.id
             JOIN users u ON r.seller_id = u.id
             WHERE r.id = $1 AND r.customer_id = $2`,
            [id, customerId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Return request not found', 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get customer's returns
 * @route   GET /api/v1/returns
 * @access  Private (Customer)
 */
export const getMyReturns = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { status, page = 1, limit = 10 } = req.query;

        let queryText = `
            SELECT r.*,
                   o.order_number,
                   p.name_en as product_name, p.images as product_images,
                   pv.size
            FROM returns r
            JOIN orders o ON r.order_id = o.id
            JOIN products p ON r.product_id = p.id
            LEFT JOIN product_variants pv ON r.variant_id = pv.id
            WHERE r.customer_id = $1
        `;

        const params: any[] = [customerId];
        let paramIndex = 2;

        if (status) {
            queryText += ` AND r.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        queryText += ` ORDER BY r.requested_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(Number(limit));
        params.push((Number(page) - 1) * Number(limit));

        const result = await query(queryText, params);

        // Get total count with same filters
        let countQuery = 'SELECT COUNT(*) FROM returns WHERE customer_id = $1';
        const countParams: any[] = [customerId];

        if (status) {
            countQuery += ' AND status = $2';
            countParams.push(status);
        }

        const countResult = await query(countQuery, countParams);
        const totalReturns = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                returns: result.rows,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalReturns,
                    totalPages: Math.ceil(totalReturns / Number(limit))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel a return request
 * @route   PATCH /api/v1/returns/:id/cancel
 * @access  Private (Customer)
 */
export const cancelReturn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const customerId = req.user!.id;
        const { id } = req.params;

        // Get return details
        const returnResult = await query(
            'SELECT * FROM returns WHERE id = $1 AND customer_id = $2',
            [id, customerId]
        );

        if (returnResult.rows.length === 0) {
            throw new AppError('Return request not found', 404);
        }

        const returnRequest = returnResult.rows[0];

        // Only pending/requested returns can be cancelled
        if (!['requested', 'pending'].includes(returnRequest.status)) {
            throw new AppError('This return request cannot be cancelled', 400);
        }

        await transaction(async (client) => {
            // Update return status
            await client.query(
                `UPDATE returns SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
                [id]
            );

            // Restore order status
            await client.query(
                `UPDATE orders SET status = 'delivered', updated_at = NOW() WHERE id = $1`,
                [returnRequest.order_id]
            );
        });

        res.status(200).json({
            success: true,
            message: 'Return request cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

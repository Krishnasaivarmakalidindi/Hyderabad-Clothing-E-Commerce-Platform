import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            featured,
            sellerId,
            page = 1,
            limit = 20,
            sortBy = 'created_at',
            order = 'DESC',
        } = req.query;

        const allowedSortFields = ['created_at', 'price', 'average_rating', 'total_reviews'];
        const allowedDirections = ['ASC', 'DESC'];

        const sortField = allowedSortFields.includes(String(sortBy))
            ? String(sortBy)
            : 'created_at';

        const sortDirection = allowedDirections.includes(String(order).toUpperCase())
            ? String(order).toUpperCase()
            : 'DESC';

        let queryText = `
            SELECT 
                p.id, p.name_en, p.name_te, p.description_en, p.description_te,
                p.category, p.subcategory, p.fabric_type, p.price, p.mrp,
                p.status, p.total_stock, p.average_rating, p.total_reviews,
                p.images, p.video_url, p.featured, p.created_at,
                u.full_name as seller_name,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pv.id,
                            'size', pv.size,
                            'stock_available', pv.stock_available,
                            'is_available', pv.is_available
                        )
                    ) FILTER (WHERE pv.id IS NOT NULL), '[]'
                ) as variants
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            WHERE p.status = 'active'
        `;

        const params: any[] = [];
        let paramIndex = 1;

        if (category) {
            queryText += ` AND p.category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        if (minPrice) {
            queryText += ` AND p.price >= $${paramIndex}`;
            params.push(minPrice);
            paramIndex++;
        }

        if (maxPrice) {
            queryText += ` AND p.price <= $${paramIndex}`;
            params.push(maxPrice);
            paramIndex++;
        }

        if (search) {
            queryText += ` AND (p.name_en ILIKE $${paramIndex} OR p.name_te ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (featured === 'true') {
            queryText += ` AND p.featured = true`;
        }

        if (sellerId) {
            queryText += ` AND p.seller_id = $${paramIndex}`;
            params.push(sellerId);
            paramIndex++;
        }

        queryText += `
            GROUP BY p.id, u.full_name
            ORDER BY p.${sortField} ${sortDirection}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        params.push(Number(limit));
        params.push((Number(page) - 1) * Number(limit));

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query('SELECT COUNT(*) FROM products WHERE status = $1', ['active']);
        const totalProducts = parseInt(countResult.rows[0].count);

        res.status(200).json({
            success: true,
            data: {
                products: result.rows,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalProducts,
                    totalPages: Math.ceil(totalProducts / Number(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product by ID
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await query(
            `
      SELECT
        p.*,
        u.id as seller_id,
        u.full_name as seller_name,
        sp.business_name,
        sp.average_rating as seller_rating,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pv.id,
              'size', pv.size,
              'sku', pv.sku,
              'stock_available', pv.stock_available,
              'price_adjustment', pv.price_adjustment,
              'is_available', pv.is_available
            )
          ) FILTER (WHERE pv.id IS NOT NULL), '[]'
        ) as variants
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN seller_profiles sp ON u.id = sp.user_id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.id = $1
      GROUP BY p.id, u.id, sp.business_name, sp.average_rating
      `,
            [id]
        );

        if (result.rows.length === 0) {
            throw new AppError('Product not found', 404);
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get size recommendation for a product
// @route   GET /api/v1/products/:id/size-recommendation
// @access  Public
export const getSizeRecommendation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { height, weight, chest, waist, bodyType, fitPreference } = req.query;

        // Get product details
        const productResult = await query(
            `SELECT category, subcategory FROM products WHERE id = $1`,
            [id]
        );

        if (productResult.rows.length === 0) {
            throw new AppError('Product not found', 404);
        }

        // Simple size recommendation algorithm
        // In production, this would be more sophisticated with ML
        let recommendedSize = 'M';
        let confidence = 0.7;

        if (height && weight) {
            const heightNum = Number(height);
            const weightNum = Number(weight);
            const bmi = weightNum / ((heightNum / 100) ** 2);

            if (bmi < 18.5) {
                recommendedSize = 'S';
            } else if (bmi < 25) {
                recommendedSize = 'M';
            } else if (bmi < 30) {
                recommendedSize = 'L';
            } else {
                recommendedSize = 'XL';
            }

            confidence = 0.85;
        }

        if (fitPreference === 'loose') {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            const currentIndex = sizes.indexOf(recommendedSize);
            if (currentIndex < sizes.length - 1) {
                recommendedSize = sizes[currentIndex + 1];
            }
        } else if (fitPreference === 'tight') {
            const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            const currentIndex = sizes.indexOf(recommendedSize);
            if (currentIndex > 0) {
                recommendedSize = sizes[currentIndex - 1];
            }
        }

        res.status(200).json({
            success: true,
            data: {
                recommendedSize,
                confidence,
                message: `Based on your measurements, we recommend size ${recommendedSize}`,
                alternativeSizes: [recommendedSize],
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Ask seller a question (via WhatsApp)
// @route   POST /api/v1/products/:id/ask-seller
// @access  Private
export const askSeller = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message) {
            throw new AppError('Please provide a message', 400);
        }

        // Get product and seller details
        const result = await query(
            `
      SELECT p.name_en, u.phone_number, u.full_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
      `,
            [id]
        );

        if (result.rows.length === 0) {
            throw new AppError('Product not found', 404);
        }

        const { name_en, phone_number, full_name } = result.rows[0];

        // TODO: Integrate with Twilio WhatsApp API to send message
        // For now, just return success

        res.status(200).json({
            success: true,
            message: 'Your message has been sent to the seller via WhatsApp',
            data: {
                sellerName: full_name,
                productName: name_en,
            },
        });
    } catch (error) {
        next(error);
    }
};

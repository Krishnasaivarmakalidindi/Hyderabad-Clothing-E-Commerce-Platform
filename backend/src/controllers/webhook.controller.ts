import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '../middleware/error.middleware.js';
import { env } from '../config/env.js';
import { query } from '../config/database.js';

/**
 * Verify Razorpay webhook signature
 * @see https://razorpay.com/docs/webhooks/validate-test/
 */
function verifyRazorpaySignature(
    body: string,
    signature: string | undefined,
    secret: string
): boolean {
    if (!signature) {
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch {
        return false;
    }
}

/**
 * Razorpay Webhook Handler
 * Handles payment status updates from Razorpay
 */
export const razorpayWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string | undefined;
        const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('RAZORPAY_WEBHOOK_SECRET not configured');
            throw new AppError('Webhook configuration error', 500);
        }

        // Get raw body for signature verification
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        // Verify signature
        if (!verifyRazorpaySignature(rawBody, signature, webhookSecret)) {
            console.warn('Razorpay webhook signature verification failed');
            throw new AppError('Invalid webhook signature', 400);
        }

        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;

        console.log(`Razorpay webhook received: ${event}`);

        switch (event) {
            case 'payment.captured':
                if (paymentEntity) {
                    await handlePaymentCaptured(paymentEntity);
                }
                break;

            case 'payment.failed':
                if (paymentEntity) {
                    await handlePaymentFailed(paymentEntity);
                }
                break;

            case 'refund.created':
                const refundEntity = payload.payload?.refund?.entity;
                if (refundEntity) {
                    await handleRefundCreated(refundEntity);
                }
                break;

            default:
                console.log(`Unhandled Razorpay event: ${event}`);
        }

        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        next(error);
    }
};

async function handlePaymentCaptured(payment: {
    id: string;
    order_id: string;
    amount: number;
    notes?: { order_id?: string };
}): Promise<void> {
    const orderId = payment.notes?.order_id;
    if (!orderId) return;

    await query(
        `UPDATE orders SET payment_status = 'completed', payment_id = $1, status = 'confirmed', updated_at = NOW() WHERE id = $2`,
        [payment.id, orderId]
    );
}

async function handlePaymentFailed(payment: {
    id: string;
    notes?: { order_id?: string };
    error_description?: string;
}): Promise<void> {
    const orderId = payment.notes?.order_id;
    if (!orderId) return;

    await query(
        `UPDATE orders SET payment_status = 'failed', status = 'cancelled', cancellation_reason = $1, updated_at = NOW() WHERE id = $2`,
        [payment.error_description || 'Payment failed', orderId]
    );
}

async function handleRefundCreated(refund: {
    id: string;
    amount: number;
    notes?: { return_id?: string };
}): Promise<void> {
    const returnId = refund.notes?.return_id;
    if (!returnId) return;

    await query(
        `UPDATE returns SET refund_status = 'processed', refund_id = $1, refund_amount = $2, updated_at = NOW() WHERE id = $3`,
        [refund.id, refund.amount / 100, returnId]
    );
}

/**
 * Shiprocket Webhook Handler
 */
export const shiprocketWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const signature = req.headers['x-shiprocket-signature'] as string | undefined;
        const webhookToken = env.SHIPROCKET_PASSWORD;
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        if (webhookToken && signature) {
            const expectedSig = crypto.createHmac('sha256', webhookToken).update(rawBody).digest('hex');
            try {
                if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
                    throw new AppError('Invalid webhook signature', 400);
                }
            } catch {
                throw new AppError('Invalid webhook signature', 400);
            }
        }

        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { order_id: shiprocketOrderId, awb: trackingNumber, current_status: status, delivered_date: deliveredDate } = payload;

        let orderStatus: string | null = null;
        switch (status?.toLowerCase()) {
            case 'picked up': orderStatus = 'shipped'; break;
            case 'in transit': orderStatus = 'in_transit'; break;
            case 'out for delivery': orderStatus = 'out_for_delivery'; break;
            case 'delivered': orderStatus = 'delivered'; break;
            case 'rto initiated':
            case 'rto delivered': orderStatus = 'returned'; break;
        }

        if (orderStatus && shiprocketOrderId) {
            const updates = ['status = $1', 'updated_at = NOW()'];
            const params: (string | Date)[] = [orderStatus];

            if (trackingNumber) {
                params.push(trackingNumber);
                updates.push(`tracking_number = $${params.length}`);
            }
            if (deliveredDate && orderStatus === 'delivered') {
                params.push(new Date(deliveredDate));
                updates.push(`delivered_at = $${params.length}`);
            }
            params.push(shiprocketOrderId);

            await query(`UPDATE orders SET ${updates.join(', ')} WHERE shiprocket_order_id = $${params.length}`, params);
        }

        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        next(error);
    }
};

/**
 * Twilio Webhook Handler
 */
export const twilioWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const signature = req.headers['x-twilio-signature'] as string | undefined;
        const authToken = env.TWILIO_AUTH_TOKEN;

        if (!authToken) {
            throw new AppError('Webhook configuration error', 500);
        }

        // Build URL and verify signature
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers.host;
        const url = `${protocol}://${host}${req.originalUrl}`;

        const sortedKeys = Object.keys(req.body).sort();
        let dataToSign = url;
        for (const key of sortedKeys) {
            dataToSign += key + req.body[key];
        }

        const expectedSig = crypto.createHmac('sha1', authToken).update(dataToSign).digest('base64');

        try {
            if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
                throw new AppError('Invalid webhook signature', 400);
            }
        } catch {
            throw new AppError('Invalid webhook signature', 400);
        }

        const { MessageSid, MessageStatus, From, Body } = req.body;

        if (Body && From) {
            console.log(`Incoming WhatsApp from ${From}: ${Body}`);
        }

        if (MessageStatus) {
            console.log(`Message ${MessageSid} status: ${MessageStatus}`);
        }

        res.status(200).send('');
    } catch (error) {
        next(error);
    }
};

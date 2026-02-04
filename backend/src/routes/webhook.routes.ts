import { Router } from 'express';
import {
    razorpayWebhook,
    shiprocketWebhook,
    twilioWebhook,
} from '../controllers/webhook.controller.js';

const router = Router();

// Webhook routes (no authentication required)
router.post('/razorpay', razorpayWebhook);
router.post('/shiprocket', shiprocketWebhook);
router.post('/twilio', twilioWebhook);

export default router;

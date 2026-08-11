import express from 'express';
import { createCheckoutSession, webhookHandler } from '../controllers/stripeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected route to create checkout session
router.post('/create-checkout-session', protect, createCheckoutSession);

// Note: Webhook endpoint is NOT defined here because it needs the raw body parser.
// It will be mounted directly in server.js before the global JSON body parser.

export default router;

import Stripe from 'stripe';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Create a Stripe Checkout Session
 * @route   POST /api/stripe/create-checkout-session
 * @access  Private
 */
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const { priceId } = req.body;
  const user = req.user;

  if (!priceId) {
    throw new ApiError(400, 'Price ID is required');
  }

  // Create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: user.email,
    client_reference_id: user.id.toString(), // Attach internal user ID
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.CLIENT_URL}/dashboard?checkout=success`,
    cancel_url: `${env.CLIENT_URL}/pricing?checkout=canceled`,
  });

  res.status(200).json(new ApiResponse(200, { url: session.url }, 'Checkout session created'));
});

/**
 * @desc    Handle Stripe Webhooks
 * @route   POST /api/stripe/webhook
 * @access  Public
 */
export const webhookHandler = asyncHandler(async (req, res) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Note: req.body must be raw string/buffer here, configured in server.js
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'active',
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { subscriptionStatus: 'active' }
      );
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { subscriptionStatus: 'past_due' }
      );
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { subscriptionStatus: 'canceled' }
      );
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

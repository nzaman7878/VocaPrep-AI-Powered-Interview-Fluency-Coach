import { User } from '../models/User.js';
import Session from '../models/Session.js'; // Note Session uses default export
import Stripe from 'stripe';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Get high-level admin statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getStats = asyncHandler(async (req, res) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // 1. Total Users
  const totalUsers = await User.countDocuments();

  // 2. Active Subscriptions
  const activeSubscriptions = await User.countDocuments({ subscriptionStatus: 'active' });

  // 3. Total AI Usage (Interviews started)
  const totalAIUsage = await Session.countDocuments();

  // 4. Total Revenue (Fetch recent charges from Stripe and sum them up)
  // For MVP, we fetch the 100 most recent charges. In production, caching or a separate tracking system is better.
  let totalRevenue = 0;
  try {
    const charges = await stripe.charges.list({
      limit: 100,
    });
    
    // Sum only successful, paid charges (in cents)
    const totalCents = charges.data.reduce((acc, charge) => {
      if (charge.paid && !charge.refunded) {
        return acc + charge.amount;
      }
      return acc;
    }, 0);
    
    totalRevenue = totalCents / 100; // Convert to dollars
  } catch (error) {
    console.error('Failed to fetch revenue from Stripe:', error.message);
    // Continue without crashing, revenue will be 0
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        activeSubscriptions,
        totalAIUsage,
        totalRevenue,
      },
      'Admin statistics fetched successfully'
    )
  );
});

/**
 * @desc    Get all users with pagination, filtering, and search
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};

  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Filter by subscription status
  if (req.query.subscriptionStatus) {
    query.subscriptionStatus = req.query.subscriptionStatus;
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-passwordHash') // exclude passwords
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      'Users fetched successfully'
    )
  );
});

/**
 * @desc    Update user role (grant/revoke admin)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role provided');
  }

  // Prevent users from revoking their own admin access if they are the primary admin
  const adminEmail = process.env.ADMIN_EMAIL;
  const targetUser = await User.findById(id);

  if (!targetUser) {
    throw new ApiError(404, 'User not found');
  }

  if (targetUser.email === adminEmail && role !== 'admin') {
    throw new ApiError(403, 'Cannot revoke admin access for the primary admin');
  }

  targetUser.role = role;
  await targetUser.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { user: { id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role } },
      'User role updated successfully'
    )
  );
});

/**
 * @desc    Get recent subscriptions and payment history
 * @route   GET /api/admin/subscriptions
 * @access  Private/Admin
 */
export const getSubscriptions = asyncHandler(async (req, res) => {
  // Fetch users with active/past_due/canceled subscriptions
  const subscribers = await User.find({
    subscriptionStatus: { $in: ['active', 'past_due', 'canceled'] },
  })
    .select('name email subscriptionStatus stripeCustomerId stripeSubscriptionId updatedAt')
    .sort({ updatedAt: -1 })
    .limit(50); // Get recent 50 for MVP

  // Optionally we could fetch exact payment history from Stripe here
  // But returning the subscriber base is often what the dashboard needs
  
  res.status(200).json(
    new ApiResponse(200, { subscriptions: subscribers }, 'Subscriptions fetched successfully')
  );
});

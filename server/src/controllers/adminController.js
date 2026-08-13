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

  // 4. Time Series Data Preparation (Last 6 Months)
  const months = [];
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth() + 1, // 1-12
      usersCreated: 0,
      revenueAdded: 0
    });
  }

  // Get cumulative users up to 6 months ago
  let cumulativeUsers = await User.countDocuments({ createdAt: { $lt: sixMonthsAgo } });

  // Aggregate users created in the last 6 months
  const userAggregation = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 }
      }
    }
  ]);

  // Merge user aggregation into months array
  userAggregation.forEach(agg => {
    const monthObj = months.find(m => m.month === agg._id.month && m.year === agg._id.year);
    if (monthObj) {
      monthObj.usersCreated = agg.count;
    }
  });

  // Stripe Revenue
  let totalRevenue = 0;
  let cumulativeRevenue = 0; // We'll assume starting revenue before the 100 charges is 0 for MVP
  try {
    const charges = await stripe.charges.list({
      limit: 100, // Fetching 100 most recent charges
    });
    
    // Sort charges ascending by creation date
    const sortedCharges = charges.data
      .filter(charge => charge.paid && !charge.refunded)
      .sort((a, b) => a.created - b.created);

    sortedCharges.forEach(charge => {
      const amount = charge.amount / 100;
      totalRevenue += amount;
      
      const chargeDate = new Date(charge.created * 1000);
      if (chargeDate >= sixMonthsAgo) {
        const monthObj = months.find(m => m.month === (chargeDate.getMonth() + 1) && m.year === chargeDate.getFullYear());
        if (monthObj) {
          monthObj.revenueAdded += amount;
        } else {
           // Charge is newer than our 6-month window? (Shouldn't happen)
        }
      } else {
        // Charge is older than 6 months, add to base cumulative
        cumulativeRevenue += amount;
      }
    });
  } catch (error) {
    console.error('Failed to fetch revenue from Stripe:', error.message);
  }

  // Build final timeSeries array
  const timeSeriesData = months.map(m => {
    cumulativeUsers += m.usersCreated;
    cumulativeRevenue += m.revenueAdded;
    return {
      month: m.label,
      Users: cumulativeUsers,
      Revenue: Math.round(cumulativeRevenue)
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        activeSubscriptions,
        totalAIUsage,
        totalRevenue,
        timeSeriesData
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

/**
 * @desc    Get recent transactions from Stripe
 * @route   GET /api/admin/transactions
 * @access  Private/Admin
 */
export const getTransactions = asyncHandler(async (req, res) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  
  try {
    const charges = await stripe.charges.list({
      limit: 50,
    });
    
    // Map to a cleaner format for the frontend
    const transactions = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100, // Convert from cents
      currency: charge.currency,
      status: charge.status,
      receiptEmail: charge.receipt_email || charge.billing_details?.email || 'N/A',
      createdAt: new Date(charge.created * 1000).toISOString(),
      paid: charge.paid,
      refunded: charge.refunded
    }));
    
    res.status(200).json(
      new ApiResponse(200, { transactions }, 'Transactions fetched successfully')
    );
  } catch (error) {
    throw new ApiError(500, 'Failed to fetch transactions from Stripe: ' + error.message);
  }
});

/**
 * @desc    Get detailed AI analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  // Aggregate sessions by role
  const sessionsByRole = await Session.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        name: '$_id',
        value: '$count',
        _id: 0
      }
    },
    {
      $sort: { value: -1 }
    }
  ]);

  // Calculate average WPM and Content Score across all questions in all sessions
  // Since questions is an array inside sessions, we need to unwind it first
  const averages = await Session.aggregate([
    { $unwind: '$questions' },
    {
      $group: {
        _id: null,
        avgWpm: { $avg: '$questions.deliveryMetrics.wpm' },
        avgContentScore: { $avg: '$questions.contentScore' },
        avgFillerRate: { $avg: '$questions.deliveryMetrics.fillerRate' }
      }
    }
  ]);

  const stats = averages.length > 0 ? averages[0] : {
    avgWpm: 0,
    avgContentScore: 0,
    avgFillerRate: 0
  };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        sessionsByRole,
        globalAverages: {
          wpm: Math.round(stats.avgWpm || 0),
          contentScore: Number((stats.avgContentScore || 0).toFixed(1)),
          fillerRate: Number((stats.avgFillerRate || 0).toFixed(1))
        }
      },
      'Analytics fetched successfully'
    )
  );
});

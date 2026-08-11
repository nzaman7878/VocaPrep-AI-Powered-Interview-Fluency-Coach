import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Middleware to enforce the 3-use free limit
 */
export const enforceUsageLimit = asyncHandler(async (req, res, next) => {
  const user = req.user;
  
  if (!user) {
    throw new ApiError(401, 'Not authorized');
  }

  // If they have an active subscription, let them through
  if (user.subscriptionStatus === 'active') {
    return next();
  }

  // If they are on the free tier, check limit
  if (user.usageCount >= 3) {
    return res.status(403).json({
      success: false,
      requiresUpgrade: true,
      message: 'You have reached your free tier limit. Please upgrade to continue practicing.',
    });
  }

  next();
});

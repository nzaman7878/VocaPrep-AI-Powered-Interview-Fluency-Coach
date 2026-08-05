import { User } from '../models/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is attached by the protect middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json(new ApiResponse(200, user, 'User profile retrieved successfully'));
  } else {
    throw new ApiError(404, 'User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.targetRole = req.body.targetRole || user.targetRole;

    if (req.body.weakAreas && Array.isArray(req.body.weakAreas)) {
      user.weakAreas = req.body.weakAreas;
    }

    // Handle password update if provided
    if (req.body.password) {
      user.passwordHash = req.body.password;
    }

    const updatedUser = await user.save();

    // Prevent returning password hash
    updatedUser.passwordHash = undefined;

    res.status(200).json(new ApiResponse(200, updatedUser, 'User profile updated successfully'));
  } else {
    throw new ApiError(404, 'User not found');
  }
});

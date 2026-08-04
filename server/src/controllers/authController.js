import { User } from '../models/User.js';
import { generateAuthTokens } from '../services/tokenService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, targetRole } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    passwordHash: password, // Mongoose pre-save hook handles hashing
    targetRole,
  });

  if (user) {
    const { accessToken, refreshToken } = generateAuthTokens(user);

    // Remove passwordHash from response
    user.passwordHash = undefined;

    res.status(201).json(
      new ApiResponse(
        201,
        {
          user,
          accessToken,
          refreshToken,
        },
        'User registered successfully'
      )
    );
  } else {
    throw new ApiError(500, 'Failed to register user');
  }
});

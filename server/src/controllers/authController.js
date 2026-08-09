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

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  // Find user and explicitly select passwordHash
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateAuthTokens(user);

  // Remove passwordHash from response
  user.passwordHash = undefined;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        accessToken,
        refreshToken,
      },
      'User logged in successfully'
    )
  );
});

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    const { verifyToken } = await import('../services/tokenService.js');
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const { generateAuthTokens } = await import('../services/tokenService.js');
    const tokens = generateAuthTokens(user);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        'Token refreshed successfully'
      )
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

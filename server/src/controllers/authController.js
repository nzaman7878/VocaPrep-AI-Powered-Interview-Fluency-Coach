import { User } from '../models/User.js';
import { generateAuthTokens } from '../services/tokenService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * @desc    Authenticate with Google OAuth
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, 'Google ID token is required');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, 'Invalid Google token');
  }

  const { sub: googleId, email, name, picture } = payload;

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    // If user exists but doesn't have a googleId, link it
    if (!user.googleId) {
      user.googleId = googleId;
      if (picture && !user.picture) {
        user.picture = picture;
      }
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      googleId,
      picture,
    });
  }

  // Generate our native JWTs
  const { accessToken, refreshToken } = generateAuthTokens(user);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        accessToken,
        refreshToken,
      },
      'User authenticated successfully'
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

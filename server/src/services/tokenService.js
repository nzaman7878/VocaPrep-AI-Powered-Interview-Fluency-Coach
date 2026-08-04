import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Generate Access and Refresh tokens for a user
 * @param {Object} user - The user object (typically from Mongoose)
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateAuthTokens = (user) => {
  const payload = {
    id: user._id,
    targetRole: user.targetRole,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m', // Short lived access token
  });

  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d', // Long lived refresh token
  });

  return { accessToken, refreshToken };
};

/**
 * Verify a token (Access or Refresh)
 * @param {string} token - The JWT string
 * @returns {Object} The decoded payload if valid
 * @throws {ApiError} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token has expired');
    }
    throw new ApiError(401, 'Invalid token');
  }
};

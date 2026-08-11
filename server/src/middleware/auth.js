import { verifyToken } from '../services/tokenService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';

/**
 * Protect routes - verify JWT token and attach user to req
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from the token payload and attach to req (excluding password)
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      throw new ApiError(401, 'Not authorized, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Not authorized, invalid token');
  }
});

/**
 * Admin middleware - check if user is admin and matches ADMIN_EMAIL
 */
export const isAdmin = asyncHandler(async (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('ADMIN_EMAIL environment variable is not set!');
    throw new ApiError(500, 'Server configuration error');
  }

  if (req.user && req.user.role === 'admin' && req.user.email === adminEmail) {
    next();
  } else {
    throw new ApiError(403, 'Not authorized as an admin');
  }
});

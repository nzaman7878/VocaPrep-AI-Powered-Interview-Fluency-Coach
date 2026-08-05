import Session from '../models/Session.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Create a new interview session
 * @route   POST /api/sessions
 * @access  Private
 */
export const createSession = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, 'Role is required to start a session');
  }

  const session = await Session.create({
    userId: req.user.id,
    role,
    status: 'in_progress',
    totalQuestions: 0,
    questions: [],
  });

  res.status(201).json(new ApiResponse(201, session, 'Session created successfully'));
});

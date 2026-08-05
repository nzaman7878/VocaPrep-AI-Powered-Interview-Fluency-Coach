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

/**
 * @desc    Get user sessions (paginated)
 * @route   GET /api/sessions
 * @access  Private
 */
export const getSessions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await Session.countDocuments({ userId: req.user.id });
  const sessions = await Session.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .select('-questions'); // Exclude embedded questions for the list view to save bandwidth

  res.status(200).json(
    new ApiResponse(
      200,
      {
        sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Sessions retrieved successfully'
    )
  );
});

/**
 * @desc    Get single session by ID
 * @route   GET /api/sessions/:id
 * @access  Private
 */
export const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  res.status(200).json(new ApiResponse(200, session, 'Session retrieved successfully'));
});

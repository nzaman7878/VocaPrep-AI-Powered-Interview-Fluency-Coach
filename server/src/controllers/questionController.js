import Session from '../models/Session.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Add a new question attempt to a session
 * @route   POST /api/sessions/:id/questions
 * @access  Private
 */
export const addQuestionAttempt = asyncHandler(async (req, res) => {
  const {
    questionText,
    questionType,
    transcript,
    audioUrl,
    contentScore,
    deliveryMetrics,
    feedback,
    contentFeedback,
    deliveryFeedback,
  } = req.body;

  if (!questionText || !questionType) {
    throw new ApiError(400, 'questionText and questionType are required');
  }

  // Find the session and ensure it belongs to the user
  const session = await Session.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  if (session.status !== 'in_progress') {
    throw new ApiError(400, 'Cannot add questions to a completed or abandoned session');
  }

  const newAttempt = {
    questionText,
    questionType,
    transcript,
    audioUrl,
    contentScore,
    deliveryMetrics,
    feedback,
    contentFeedback,
    deliveryFeedback,
  };

  session.questions.push(newAttempt);


  await session.save();

  // Return the newly added question attempt
  const addedAttempt = session.questions[session.questions.length - 1];

  res.status(201).json(new ApiResponse(201, addedAttempt, 'Question attempt added successfully'));
});

/**
 * @desc    Update a question attempt (after AI evaluation)
 * @route   PUT /api/sessions/:id/questions/:questionIndex
 * @access  Private
 */
export const updateQuestionAttempt = asyncHandler(async (req, res) => {
  const { questionIndex } = req.params;
  const {
    transcript,
    audioUrl,
    contentScore,
    deliveryMetrics,
    feedback,
    contentFeedback,
    deliveryFeedback,
  } = req.body;

  const session = await Session.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  const index = parseInt(questionIndex, 10);

  if (isNaN(index) || index < 0 || index >= session.questions.length) {
    throw new ApiError(404, 'Question attempt not found at the specified index');
  }

  // Update fields if provided
  const attempt = session.questions[index];
  if (transcript !== undefined) attempt.transcript = transcript;
  if (audioUrl !== undefined) attempt.audioUrl = audioUrl;
  if (contentScore !== undefined) attempt.contentScore = contentScore;
  if (deliveryMetrics !== undefined) attempt.deliveryMetrics = deliveryMetrics;
  if (feedback !== undefined) attempt.feedback = feedback;
  if (contentFeedback !== undefined) attempt.contentFeedback = contentFeedback;
  if (deliveryFeedback !== undefined) attempt.deliveryFeedback = deliveryFeedback;

  await session.save();

  res.status(200).json(new ApiResponse(200, attempt, 'Question attempt updated successfully'));
});

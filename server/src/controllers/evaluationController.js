import asyncHandler from '../utils/asyncHandler.js';
import evaluationService from '../services/evaluationService.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * @desc    Evaluate a candidate's answer using the LangGraph AI Pipeline
 * @route   POST /api/evaluate
 * @access  Private
 */
export const evaluateAnswer = asyncHandler(async (req, res) => {
  const { sessionId, attemptId, transcript, wordTimestamps } = req.body;

  if (!sessionId || !attemptId || !transcript) {
    throw new ApiError(400, 'Missing required fields: sessionId, attemptId, transcript');
  }

  // The evaluation service handles pulling the context, running the LLMs,
  // and saving the output directly back to the database.
  const evaluationResult = await evaluationService.evaluateAnswer(sessionId, attemptId, {
    transcript,
    wordTimestamps: wordTimestamps || [],
  });

  res.status(200).json(new ApiResponse(200, evaluationResult, 'Answer evaluated successfully'));
});

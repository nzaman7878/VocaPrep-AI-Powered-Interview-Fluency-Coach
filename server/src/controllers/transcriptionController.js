import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { transcribeAudio } from '../services/transcriptionService.js';

/**
 * @desc    Submit audio URL to AssemblyAI for transcription
 * @route   POST /api/transcription
 * @access  Private
 */
export const transcribe = asyncHandler(async (req, res) => {
  const { audioUrl } = req.body;

  if (!audioUrl) {
    throw new ApiError(400, 'Audio URL is required');
  }

  // Submit to AssemblyAI and poll for results
  const result = await transcribeAudio(audioUrl);

  res.status(200).json(
    new ApiResponse(200, result, 'Transcription completed successfully')
  );
});

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadAudioBufferToCloudinary } from '../services/audioService.js';

/**
 * @desc    Upload audio file to Cloudinary
 * @route   POST /api/audio/upload
 * @access  Private
 */
export const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No audio file provided');
  }

  // Upload buffer to Cloudinary
  const result = await uploadAudioBufferToCloudinary(req.file.buffer, req.file.mimetype);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration, // Note: Cloudinary auto-detects duration for audio/video
        format: result.format,
      },
      'Audio uploaded successfully'
    )
  );
});

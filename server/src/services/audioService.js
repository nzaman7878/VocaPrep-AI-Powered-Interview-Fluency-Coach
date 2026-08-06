import cloudinary from '../config/cloudinary.js';

/**
 * Uploads an audio buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - The audio file buffer
 * @param {string} mimetype - The mime type (e.g. 'audio/webm')
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadAudioBufferToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    // Cloudinary treats audio as 'video' resource type
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'vocaprep_audio_attempts',
        format: 'webm', // Standardize storage to webm
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    // End the stream with the buffer data
    uploadStream.end(buffer);
  });
};

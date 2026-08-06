import axiosClient from './axiosClient';

/**
 * Uploads an audio blob to the backend Cloudinary service
 * @param {Blob} audioBlob - The recorded webm audio blob
 * @param {Function} onUploadProgress - Callback for tracking Axios upload progress
 * @returns {Promise<Object>} - Contains secure_url, duration, format
 */
export const uploadAudio = async (audioBlob, onUploadProgress) => {
  const formData = new FormData();
  // Name the file, backend multer expects field 'audio'
  formData.append('audio', audioBlob, 'recording.webm');

  const response = await axiosClient.post('/audio/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response.data.data;
};

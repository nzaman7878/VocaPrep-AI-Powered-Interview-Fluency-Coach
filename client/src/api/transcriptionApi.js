import axiosClient from './axiosClient';

/**
 * Submits an audio URL to the backend for AssemblyAI transcription orchestration
 * @param {string} audioUrl - The Cloudinary secure_url of the uploaded audio
 * @returns {Promise<{text: string, words: Array}>} - Transcription text and word-level timestamps
 */
export const transcribeAudio = async (audioUrl) => {
  const response = await axiosClient.post('/transcription', { audioUrl });
  return response.data.data;
};

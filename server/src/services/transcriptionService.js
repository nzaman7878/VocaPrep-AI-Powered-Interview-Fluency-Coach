import { env } from '../config/env.js';

const ASSEMBLYAI_BASE_URL = 'https://api.assemblyai.com/v2';

/**
 * Polls AssemblyAI until the transcription is completed or fails.
 * @param {string} transcriptId
 * @param {string} apiKey
 * @param {number} maxAttempts
 * @param {number} intervalMs
 * @returns {Promise<Object>}
 */
const pollTranscription = async (transcriptId, apiKey, maxAttempts = 60, intervalMs = 3000) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to poll AssemblyAI: ${errorData}`);
    }

    const data = await response.json();

    if (data.status === 'completed') {
      // Extract only the necessary data with word-level timestamps
      const words = data.words
        ? data.words.map((w) => ({
            text: w.text,
            start: w.start, // start time in milliseconds
            end: w.end, // end time in milliseconds
            confidence: w.confidence, // confidence score 0.0 - 1.0
          }))
        : [];

      return {
        text: data.text,
        words,
      };
    } else if (data.status === 'error') {
      throw new Error(`AssemblyAI transcription failed: ${data.error}`);
    }

    // If 'processing' or 'queued', wait before polling again
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Transcription polling timed out');
};

/**
 * Submits an audio URL to AssemblyAI for transcription and polls until complete.
 * @param {string} audioUrl - The secure_url of the uploaded audio (e.g. from Cloudinary)
 * @returns {Promise<{text: string, words: Array}>} - Transcription results with word-level timestamps
 */
export const transcribeAudio = async (audioUrl) => {
  const apiKey = env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error('ASSEMBLYAI_API_KEY is missing from environment variables');
  }

  // 1. Submit audio URL for transcription
  const submitResponse = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript`, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
    }),
  });

  if (!submitResponse.ok) {
    const errorData = await submitResponse.text();
    throw new Error(`Failed to submit to AssemblyAI: ${errorData}`);
  }

  const submitData = await submitResponse.json();
  const transcriptId = submitData.id;

  // 2. Poll for completion
  return await pollTranscription(transcriptId, apiKey);
};

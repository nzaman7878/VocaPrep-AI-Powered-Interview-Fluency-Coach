import { uploadAudio } from './audioApi';
import { transcribeAudio } from './transcriptionApi';
import { questionApi } from './questionApi';
import { evaluationApi } from './evaluationApi';

export const interviewApi = {
  /**
   * Orchestrates the entire pipeline for processing a user's recorded answer.
   * 1. Uploads the audio
   * 2. Transcribes the audio
   * 3. Saves the initial question attempt to the database
   * 4. Triggers the AI evaluation pipeline
   *
   * @param {string} sessionId - The current session ID
   * @param {Blob} audioBlob - The recorded webm blob
   * @param {Object} currentQuestionData - The active question object { text, type }
   * @param {Function} onProgress - Callback to notify UI of state changes
   * @returns {Promise<Object>} - The full evaluation result including transcript
   */
  processAnswerPipeline: async (sessionId, audioBlob, currentQuestionData, onProgress) => {
    // 1. Upload
    onProgress('UPLOADING');
    const uploadResult = await uploadAudio(audioBlob, (progressEvent) => {
      // Could pass fine-grained upload progress here if needed
    });

    // 2. Transcribe
    onProgress('TRANSCRIBING');
    const transcriptionResult = await transcribeAudio(uploadResult.secure_url);

    // 3. Save Question Attempt to DB (Generates an Attempt ID)
    const attemptResponse = await questionApi.addQuestionAttempt(sessionId, {
      questionText: currentQuestionData.text,
      questionType: currentQuestionData.type,
      transcript: transcriptionResult.text,
      audioUrl: uploadResult.secure_url,
    });

    const attemptId = attemptResponse.data._id;

    // 4. Evaluate via LangGraph
    onProgress('EVALUATING');
    const evalResponse = await evaluationApi.evaluateAnswer(
      sessionId,
      attemptId,
      transcriptionResult.text,
      transcriptionResult.words
    );

    return {
      transcript: transcriptionResult.text,
      ...evalResponse.data,
    };
  },
};

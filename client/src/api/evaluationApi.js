import axiosClient from './axiosClient';

export const evaluationApi = {
  evaluateAnswer: async (sessionId, attemptId, transcript, wordTimestamps) => {
    const response = await axiosClient.post('/evaluate', {
      sessionId,
      attemptId,
      transcript,
      wordTimestamps,
    });
    return response.data; // { data: { coachingReport } }
  },
};

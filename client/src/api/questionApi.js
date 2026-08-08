import axiosClient from './axiosClient';

export const questionApi = {
  generateQuestion: async (sessionId, role, questionType = 'behavioral') => {
    const response = await axiosClient.post('/questions/generate', {
      sessionId,
      role,
      questionType,
    });
    return response.data; // { data: { questionText: '...' } }
  },

  addQuestionAttempt: async (sessionId, data) => {
    // data: { questionText, questionType, audioUrl, transcript }
    const response = await axiosClient.post(`/sessions/${sessionId}/questions`, data);
    return response.data;
  },
};

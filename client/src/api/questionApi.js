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
};

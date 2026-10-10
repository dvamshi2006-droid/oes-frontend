import api from './api';

export const attemptService = {
  startExam: async (examId) => {
    const response = await api.post(`/exams/${examId}/start`);
    return response.data;
  },

  getAttemptQuestions: async (attemptId) => {
    const response = await api.get(`/attempts/${attemptId}/questions`);
    return response.data;
  },

  saveAnswer: async (attemptId, questionId, selectedAnswer) => {
    const response = await api.put(`/attempts/${attemptId}/answers/${questionId}`, { selectedAnswer });
    return response.data;
  },

  submitExam: async (attemptId, answers) => {
    const response = await api.post(`/attempts/${attemptId}/submit`, { answers });
    return response.data;
  }
};

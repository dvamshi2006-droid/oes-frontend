import api from './api';

export const questionService = {
  getQuestionsByExam: async (examId) => {
    const response = await api.get(`/exams/${examId}/questions`);
    return response.data;
  },

  getQuestionById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  addQuestion: async (examId, questionData) => {
    const response = await api.post(`/exams/${examId}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (id, questionData) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};

import api from './api';

export const resultService = {
  getMyResults: async () => {
    const response = await api.get('/results/me');
    return response.data;
  },

  getMyHistory: async () => {
    const response = await api.get('/results/me/history');
    return response.data;
  },

  getAllResults: async () => {
    const response = await api.get('/results');
    return response.data;
  },

  getResultsByStudent: async (studentId) => {
    const response = await api.get(`/results/student/${studentId}`);
    return response.data;
  },

  getResultsByExam: async (examId) => {
    const response = await api.get(`/results/exam/${examId}`);
    return response.data;
  },

  getResultById: async (id) => {
    const response = await api.get(`/results/${id}`);
    return response.data;
  }
};

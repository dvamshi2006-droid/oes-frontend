import api from './api';

export const examService = {
  getAllExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  getAvailableExams: async () => {
    const response = await api.get('/exams/available');
    return response.data;
  },

  getExamById: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  getExamInstructions: async (id) => {
    const response = await api.get(`/exams/${id}/instructions`);
    return response.data;
  },

  createExam: async (examData) => {
    const response = await api.post('/exams', examData);
    return response.data;
  },

  updateExam: async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
};

import api from './api';

export const taskService = {
  async getTasks() {
    const response = await api.get('/api/v1/tasks/');
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/api/v1/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/api/v1/tasks/', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/api/v1/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    await api.delete(`/api/v1/tasks/${id}`);
  },
};

export default taskService;

import api from './api';

export const noteService = {
  async getNotes() {
    const response = await api.get('/api/v1/notes/');
    return response.data;
  },

  async getNote(id) {
    const response = await api.get(`/api/v1/notes/${id}`);
    return response.data;
  },

  async createNote(noteData) {
    const response = await api.post('/api/v1/notes/', noteData);
    return response.data;
  },

  async updateNote(id, noteData) {
    const response = await api.put(`/api/v1/notes/${id}`, noteData);
    return response.data;
  },

  async deleteNote(id) {
    await api.delete(`/api/v1/notes/${id}`);
  },

  async searchNotes(query) {
    const response = await api.get(`/api/v1/notes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default noteService;

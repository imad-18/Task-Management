import axios from 'axios';

// Create an axios instance with your base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server port
});

// Task API functions
export const taskApi = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  createTask: async (data: { title: string; description: string }) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  
  deleteTask: async (id: number) => {
    await api.delete(`/tasks/${id}`);
    return { message: 'Task deleted' };
  },
  
  updateTaskStatus: async (id: number, status: 'pending' | 'completed') => {
    const response = await api.patch(`/tasks/${id}`, { status });
    return response.data;
  }
};
import http from "../http-common";

export interface TaskCreateData {
  title: string;
  description: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export interface ApiResponse<T> {
  data: T;
}

// Get all tasks
export const getTasks = (): Promise<ApiResponse<Task[]>> => {
  return http.get('/tasks');
};

// Create a new task
export const createTask = (data: TaskCreateData): Promise<ApiResponse<Task>> => {
  return http.post('/tasks', data);
};

// Delete a task by ID
export const deleteTask = (id: number): Promise<ApiResponse<{ message: string }>> => {
  return http.delete(`/tasks/${id}`);
};

// Update task status
export const updateTaskStatus = (id: number, status: 'pending' | 'completed'): Promise<ApiResponse<Task>> => {
  return http.patch(`/tasks/${id}`, { status });
};

// Optional: Get a single task by ID (not in your backend but might be useful)
export const getTask = (id: number): Promise<ApiResponse<Task>> => {
  return http.get(`/tasks/${id}`);
};

// Optional: Update entire task (not in your backend but could be added)
export const updateTask = (id: number, data: Partial<TaskCreateData>): Promise<ApiResponse<Task>> => {
  return http.put(`/tasks/${id}`, data);
};
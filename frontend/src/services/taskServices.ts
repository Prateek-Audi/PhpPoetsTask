import axios from 'axios';
import { Task } from "../types/task";

const API_URL = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token') || '';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await axiosInstance.get('/tasks');
    return response.data.tasks;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error fetching tasks';
    throw new Error(errorMessage);
  }
};

export const createTask = async (task: Task): Promise<Task> => {
  try {
    const { _id, createdAt, updatedAt, ...taskData } = task;
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data.task;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error creating task';
    const errorDetails = error.response?.data?.details || [];
    throw new Error(`${errorMessage}: ${errorDetails.join(', ')}`);
  }
};

export const updateTask = async (id: string, task: Task): Promise<Task> => {
  try {
    const { _id, createdAt, updatedAt, ...taskData } = task;
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data.task;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error updating task';
    const errorDetails = error.response?.data?.details || [];
    throw new Error(`${errorMessage}: ${errorDetails.join(', ')}`);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/tasks/${id}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error deleting task';
    throw new Error(errorMessage);
  } 
};

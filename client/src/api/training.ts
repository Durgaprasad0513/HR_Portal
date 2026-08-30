import apiClient from './client';
import { ApiResponse } from '../types';

export const trainingApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/training');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/training', payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/training/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<any>>(`/training/${id}`);
    return data;
  },
  addParticipants: async (id: string, payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/training/${id}/participants`, payload);
    return data;
  },
  getMyTrainings: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/training/my-trainings');
    return data;
  },
  submitFeedback: async (id: string, payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/training/${id}/feedback`, payload);
    return data;
  },
  recordAssessment: async (id: string, payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>(`/training/${id}/assessments`, payload);
    return data;
  }
};

import apiClient from './client';
import { ApiResponse } from '../types';

export const performanceApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/performance');
    return data;
  },
  getMyReviews: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/performance/my-reviews');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/performance', payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/performance/${id}`, payload);
    return data;
  },
  approve: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/performance/${id}/approve`, payload);
    return data;
  }
};

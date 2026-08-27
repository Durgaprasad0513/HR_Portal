import apiClient from './client';
import { ApiResponse } from '../types';

export const recruitmentApi = {
  getRequisitions: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/recruitment/requisitions');
    return data;
  },
  createRequisition: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/recruitment/requisitions', payload);
    return data;
  },
  updateRequisition: async (id: string, payload: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/recruitment/requisitions/${id}`, payload);
    return data;
  },
  getCandidates: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>(`/recruitment/requisitions/${id}/candidates`);
    return data;
  },
  createCandidate: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/recruitment/candidates', payload);
    return data;
  },
  updateCandidate: async (id: string, payload: any) => {
    const { data } = await apiClient.put<ApiResponse<any>>(`/recruitment/candidates/${id}`, payload);
    return data;
  }
};

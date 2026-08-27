import apiClient from './client';
import { ApiResponse, TravelRequest } from '../types';

export const travelApi = {
  create: async (data: Partial<TravelRequest>) => {
    const { data: res } = await apiClient.post<ApiResponse<TravelRequest>>('/travel', data);
    return res;
  },
  getMyRequests: async () => {
    const { data } = await apiClient.get<ApiResponse<TravelRequest[]>>('/travel/my-requests');
    return data;
  },
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<TravelRequest[]>>('/travel');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<TravelRequest>>(`/travel/${id}`);
    return data;
  },
  updateApproval: async (id: string, payload: { approvalStatus: string; remarks?: string }) => {
    const { data } = await apiClient.patch<ApiResponse<TravelRequest>>(`/travel/${id}/approval`, payload);
    return data;
  },
  updateSettlement: async (id: string, payload: { settlementStatus: string }) => {
    const { data } = await apiClient.patch<ApiResponse<TravelRequest>>(`/travel/${id}/settlement`, payload);
    return data;
  },
};

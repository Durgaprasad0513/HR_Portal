import os

recruitmentTs = r"""import apiClient from './client';
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
    const { data } = await apiClient.patch<ApiResponse<any>>(`/recruitment/requisitions/${id}`, payload);
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
    const { data } = await apiClient.patch<ApiResponse<any>>(`/recruitment/candidates/${id}`, payload);
    return data;
  }
};
"""

assetsTs = r"""import apiClient from './client';
import { ApiResponse } from '../types';

export const assetsApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/assets');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/assets/${id}`);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/assets', payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/assets/${id}`, payload);
    return data;
  },
  assignAsset: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/assets/${id}/assign`, payload);
    return data;
  },
  returnAsset: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/assets/${id}/return`, payload);
    return data;
  }
};
"""

travelTs = r"""import apiClient from './client';
import { ApiResponse } from '../types';

export const travelApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/travel', { params });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/travel/${id}`);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/travel', payload);
    return data;
  },
  updateApproval: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/travel/${id}/approve`, payload);
    return data;
  },
  updateSettlement: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(`/travel/${id}/settle`, payload);
    return data;
  }
};
"""

with open('client/src/api/recruitment.ts', 'w') as f: f.write(recruitmentTs)
with open('client/src/api/assets.ts', 'w') as f: f.write(assetsTs)
with open('client/src/api/travel.ts', 'w') as f: f.write(travelTs)

print('Done')

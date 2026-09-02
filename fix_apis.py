with open('client/src/api/recruitment.ts', 'w') as f:
    f.write('''import apiClient from './client';
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
    const { data } = await apiClient.patch<ApiResponse<any>>(/recruitment/requisitions/, payload);
    return data;
  },
  getCandidates: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>(/recruitment/requisitions//candidates);
    return data;
  },
  createCandidate: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/recruitment/candidates', payload);
    return data;
  },
  updateCandidate: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(/recruitment/candidates/, payload);
    return data;
  }
};''')

with open('client/src/api/assets.ts', 'w') as f:
    f.write('''import apiClient from './client';
import { ApiResponse } from '../types';

export const assetsApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/assets');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(/assets/);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/assets', payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(/assets/, payload);
    return data;
  },
  assignAsset: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(/assets//assign, payload);
    return data;
  },
  returnAsset: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(/assets//return, payload);
    return data;
  }
};''')

with open('client/src/api/travel.ts', 'w') as f:
    f.write('''import apiClient from './client';
import { ApiResponse } from '../types';

export const travelApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/travel', { params });
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(/travel/);
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<any>>('/travel', payload);
    return data;
  },
  updateApproval: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(/travel//approve, payload);
    return data;
  },
  updateSettlement: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<any>>(/travel//settle, payload);
    return data;
  }
};''')

print('Done!')

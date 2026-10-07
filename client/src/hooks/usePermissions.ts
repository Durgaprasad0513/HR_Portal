import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type { ModuleKey } from '@/types';

interface ModulePermission {
 canView: boolean;
 canAdd: boolean;
 canEdit: boolean;
 canDelete: boolean;
 canApprove: boolean;
 canViewRestricted: boolean;
 canExport: boolean;
}

type PermissionsMap = Record<string, ModulePermission>;

export function usePermissions() {
 const { data, isLoading } = useQuery<PermissionsMap>({
 queryKey: ['my-permissions'],
 queryFn: async () => {
 const { data } = await apiClient.get('/permissions/my');
 return data.data as PermissionsMap;
 },
 staleTime: 5 * 60 * 1000, // Cache for 5 minutes
 });

 const canView = (module: ModuleKey | string): boolean => {
 return data?.[module]?.canView ?? false;
 };

 const canExport = (module: string): boolean => {
 return !!data?.[module]?.canView && !!data?.[module]?.canExport;
 };

 const canAdd = (module: string): boolean => {
 return !!data?.[module]?.canView && !!data?.[module]?.canAdd;
 };

 const canEdit = (module: string): boolean => {
 return !!data?.[module]?.canView && !!data?.[module]?.canEdit;
 };

 const canDelete = (module: string): boolean => {
 return !!data?.[module]?.canView && !!data?.[module]?.canDelete;
 };

 const canApprove = (module: string): boolean => {
 return !!data?.[module]?.canView && !!data?.[module]?.canApprove;
 };

 const canViewRestricted = (module: string): boolean => {
 return !!data?.[module]?.canView && !!data?.[module]?.canViewRestricted;
 };

 return {
 permissions: data,
 isLoading,
 canView,
 canExport,
 canAdd,
 canEdit,
 canDelete,
 canApprove,
 canViewRestricted,
 };
}

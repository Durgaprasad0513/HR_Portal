import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

export function useDashboardStats(userId?: string) {
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: () => dashboardApi.getStats().then((response: any) => response.data),
    enabled: Boolean(userId),
    // Review stages can change in another user's session while this card is open.
    refetchInterval: 30_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });
}

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { performanceApi } from '@/api/performance';
import { PerformanceReviewModal } from '../performance/PerformanceReviewModal';
import { useDashboardStats } from './useDashboardStats';

const mocks = vi.hoisted(() => ({ role: 'HR' }));
vi.mock('@/api/dashboard', () => ({ dashboardApi: { getStats: vi.fn() } }));
vi.mock('@/api/performance', () => ({ performanceApi: { submitHrAppraisal: vi.fn() } }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: 'hr-user', employeeId: 'hr-employee', role: mocks.role } }) }));
vi.mock('@/hooks/usePermissions', () => ({ usePermissions: () => ({ canEdit: () => true, canApprove: () => true }) }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const pending = { needsAttention: [{ id: 'perf-review', module: 'Performance', title: 'Quarterly review', link: '/performance' }] };
let queryClient: QueryClient;
const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

beforeEach(() => {
  vi.clearAllMocks();
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 30_000 } } });
});
afterEach(() => { cleanup(); queryClient.clear(); vi.useRealTimers(); });

describe('dashboard performance updates', () => {
  it('refreshes a recently cached empty queue when a manager returns to the dashboard', async () => {
    vi.mocked(dashboardApi.getStats).mockResolvedValueOnce({ data: { needsAttention: [] } } as any);
    const first = renderHook(() => useDashboardStats('manager-user'), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();
    vi.mocked(dashboardApi.getStats).mockResolvedValue({ data: pending } as any);
    const second = renderHook(() => useDashboardStats('manager-user'), { wrapper });
    await waitFor(() => expect(second.result.current.data?.needsAttention).toEqual(pending.needsAttention));
  });

  it('reloads the attention queue while a manager stays on the dashboard', async () => {
    vi.useFakeTimers();
    vi.mocked(dashboardApi.getStats).mockResolvedValue({ data: { needsAttention: [] } } as any);
    const { result } = renderHook(() => useDashboardStats('manager-user'), { wrapper });
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.needsAttention).toEqual([]);
    vi.mocked(dashboardApi.getStats).mockResolvedValue({ data: pending } as any);
    await act(async () => { await vi.advanceTimersByTimeAsync(30_001); });
    await act(async () => { await vi.advanceTimersByTimeAsync(10); });
    expect(dashboardApi.getStats).toHaveBeenCalledTimes(2);
    expect(result.current.data?.needsAttention).toEqual(pending.needsAttention);
  });

  it('fetches a different user’s queue instead of reusing the previous user’s fresh data', async () => {
    vi.mocked(dashboardApi.getStats).mockResolvedValueOnce({ data: pending } as any);
    const { result, rerender } = renderHook(({ userId }) => useDashboardStats(userId), { wrapper, initialProps: { userId: 'manager-user' } });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    vi.mocked(dashboardApi.getStats).mockResolvedValue({ data: { needsAttention: [] } } as any);
    rerender({ userId: 'another-manager' });
    await waitFor(() => expect(result.current.data?.needsAttention).toEqual([]));
  });

  it('invalidates dashboard metrics and attention after HR hands a review to the manager', async () => {
    const key = ['dashboard-stats', 'hr-user'];
    queryClient.setQueryData(key, { needsAttention: [] });
    vi.mocked(performanceApi.submitHrAppraisal).mockResolvedValue({ data: { status: 'MANAGER_REVIEW' } } as any);
    const metricRatings = Object.fromEntries(['WORK_QUALITY', 'PRODUCTIVITY_RELIABILITY', 'COMMUNICATION', 'COLLABORATION', 'OWNERSHIP_INITIATIVE', 'PROFESSIONAL_CONDUCT', 'LEARNING_ADAPTABILITY'].map(key => [key, 3]));
    const onClose = vi.fn();
    render(<PerformanceReviewModal isOpen onClose={onClose} review={{ id: 'review', employeeId: 'team-employee', status: 'HR_REVIEW', hrMetricRatings: metricRatings }} />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Submit HR review' }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(performanceApi.submitHrAppraisal).toHaveBeenCalled();
    expect(queryClient.getQueryState(key)?.isInvalidated).toBe(true);
  });
});

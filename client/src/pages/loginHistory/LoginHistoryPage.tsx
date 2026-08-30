import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/api/audit';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoginHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: auditApi.getAll,
  });

  if (isLoading) return <LoadingSpinner />;

  const logs = data?.data || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 mb-6">Activity & Login History</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.user?.email || 'System'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {log.actionPerformed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.moduleAffected}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.ipAddress || 'N/A'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

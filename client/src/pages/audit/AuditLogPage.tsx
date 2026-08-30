export default function AuditLogPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 mb-6">Audit Log</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">hr@company.com</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">UPDATE</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">EmployeeData</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

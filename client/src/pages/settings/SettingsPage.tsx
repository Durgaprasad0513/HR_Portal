export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white mb-6">System Settings</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Password Policy</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Password Length</label>
            <input type="number" defaultValue={8} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm p-2 border" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" defaultChecked className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 dark:border-gray-600 rounded" />
            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Require Uppercase Letters</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" defaultChecked className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 dark:border-gray-600 rounded" />
            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Require Numbers</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" defaultChecked className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 dark:border-gray-600 rounded" />
            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Require Special Characters</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Expiry (Days)</label>
            <input type="number" defaultValue={90} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm p-2 border" />
          </div>
          <button className="bg-accent-500 text-white px-4 py-2 rounded-md hover:bg-accent-600">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

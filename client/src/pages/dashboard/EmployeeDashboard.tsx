import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CheckCircle, Clock, BookOpen, Monitor, Ticket, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function EmployeeDashboard() {
  const {} = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 border-indigo-100 dark:border-indigo-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Profile Completion</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">85%</h3>
              </div>
              <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Leave Balance</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12 Days</h3>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Assigned Assets</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2 Items</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Open Tickets</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1 Pending</h3>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Ticket className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-indigo-500"/> Required Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Information Security 2026</h4>
                  <span className="text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded">Due in 3 days</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">45% Completed</p>
              </div>
              
              <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Code of Conduct</h4>
                  <span className="text-xs font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">Not started</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">0% Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-emerald-500"/> Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Townhall Q3 2026 Scheduled</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Join us on Friday at 3 PM EST for the quarterly update.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">New Wellness Policy Updated</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Please review the new gym reimbursement guidelines.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

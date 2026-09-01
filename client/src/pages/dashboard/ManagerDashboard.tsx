import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, AlertCircle, TrendingUp, Calendar } from 'lucide-react';

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Team Size</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-500">Pending Approvals</p>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-400 mt-1">4</h3>
              </div>
              <div className="h-12 w-12 bg-amber-200 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Team Performance</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4.2/5.0</h3>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Team on Leave</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold">JS</div>
                  <div>
                    <p className="text-sm font-medium dark:text-gray-200">John Smith</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Leave Request (Aug 29 - Sep 2)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded">Approve</button>
                  <button className="text-xs bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded">Reject</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold">AD</div>
                  <div>
                    <p className="text-sm font-medium dark:text-gray-200">Alice Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Expense Report: ₹340.50</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded">Approve</button>
                  <button className="text-xs bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded">Reject</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Q3 Deliverables</span>
                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Customer Satisfaction</span>
                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Training Completion</span>
                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

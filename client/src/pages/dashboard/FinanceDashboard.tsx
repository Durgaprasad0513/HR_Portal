import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CreditCard, DollarSign, Receipt, PiggyBank } from 'lucide-react';

export function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Pending Settlements</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹12,450</h3>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              <span>24 claims awaiting approval</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Travel Advances</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹8,200</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              <span>Across 8 active trips</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Payroll Processing</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4 Days</h3>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <span>On track for end of month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">Budget Utilized</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">64%</h3>
              </div>
              <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              <span>Q3 Operational Budget</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Expense Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium dark:text-gray-200">Client Dinner - NY Trip</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Submitted by Mike Ross</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹345.00</p>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending Review</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium dark:text-gray-200">Software Subscriptions (August)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Submitted by IT Dept</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹1,250.00</p>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Approved</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

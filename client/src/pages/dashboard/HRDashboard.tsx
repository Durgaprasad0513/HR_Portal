import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Briefcase, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function HRDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top row: KPI cards and employee total */}
      <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-6 items-stretch">
        <div className="min-[500px]:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Job Openings', value: '5', color: 'bg-emerald-100 text-emerald-600' },
            { label: 'New Candidates', value: '60', color: 'bg-blue-100 text-blue-600' },
            { label: 'Invited for Interview', value: '25', color: 'bg-amber-100 text-amber-600' },
            { label: 'Waiting for Feedback', value: '10', color: 'bg-purple-100 text-purple-600' },
          ].map((stat) => (
            <Card key={stat.label} className="h-full text-center">
              <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white">{stat.value}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="p-4 xl:p-6 flex flex-col items-center justify-center">
            {/* Mock Donut Chart */}
            <div className="relative w-24 h-24 xl:w-32 xl:h-32 mb-6">
              <svg viewBox="0 0 36 36" className="w-full h-full circular-chart text-accent-500">
                <path
                  className="circle-bg text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                />
                <path
                  className="circle"
                  strokeDasharray="72, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-2xl font-bold text-navy-900 dark:text-white">720</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">/ 1000</span>
              </div>
            </div>
            
            <div className="w-full space-y-3">
               <div className="flex flex-col items-start gap-1 text-xs xl:flex-row xl:justify-between xl:items-center xl:text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent-500"></div>
                   <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Onboarding</span>
                 </div>
                 <span className="font-semibold pl-4 xl:pl-0">32%</span>
               </div>
               <div className="flex flex-col items-start gap-1 text-xs xl:flex-row xl:justify-between xl:items-center xl:text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-navy-300"></div>
                   <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Offboarding</span>
                 </div>
                 <span className="font-semibold pl-4 xl:pl-0">18%</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: recruitment and approvals */}
      <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-6 items-start">
        <div className="min-[500px]:col-span-2">
          {/* Ongoing Recruitment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <CardTitle>Ongoing recruitment</CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Job</th>
                      <th className="px-6 py-3 font-semibold">Total candidates</th>
                      <th className="px-6 py-3 font-semibold">Stage</th>
                      <th className="px-6 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium text-navy-900 dark:text-white">Senior Designer</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 dark:text-gray-500">30</td>
                      <td className="px-6 py-4">
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-accent-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-300" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium text-navy-900 dark:text-white">Developer</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 dark:text-gray-500">45</td>
                      <td className="px-6 py-4">
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-accent-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-300" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Pending Approvals */}
          <Card>
            <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-blue-600 flex items-center justify-center font-bold text-xs">SM</div>
                   <div>
                     <p className="text-sm font-semibold text-navy-900 dark:text-white">Sarah Miller</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Annual Leave</p>
                   </div>
                 </div>
                 <Badge variant="warning">Pending</Badge>
               </div>
               <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#FEE2E2] text-red-600 flex items-center justify-center font-bold text-xs">AJ</div>
                   <div>
                     <p className="text-sm font-semibold text-navy-900 dark:text-white">Alex Johnson</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Expense Report</p>
                   </div>
                 </div>
                 <Badge variant="warning">Pending</Badge>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

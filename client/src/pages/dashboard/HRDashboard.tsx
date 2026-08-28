import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, UserPlus, Briefcase, Calendar, 
  CheckSquare, Clock, Plus, MoreHorizontal, FileText 
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function HRDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Grid: Events & Total Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Events - 2 columns wide on large screens */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
            <CardTitle>Upcoming Events</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="sm">Month</Button>
              <Button variant="outline" size="sm">Year</Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6 text-sm text-gray-500 font-medium">
              <span>Mon 11</span>
              <span>Tue 12</span>
              <span className="text-navy-900 font-bold bg-navy-50 px-3 py-1 rounded-full">Wed 13</span>
              <span>Thu 14</span>
              <span>Fri 15</span>
              <span>Sat 16</span>
              <span>Sun 17</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-[#E0F2FE] p-3 rounded-lg border border-[#BAE6FD]">
                <div className="w-1.5 h-10 bg-[#38BDF8] rounded-full"></div>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">Product Team Sync</p>
                  <p className="text-xs text-gray-600 mt-0.5">10:00 AM - 11:30 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#FEE2E2] p-3 rounded-lg border border-[#FECACA]">
                <div className="w-1.5 h-10 bg-[#F87171] rounded-full"></div>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">Marketing Strategy Review</p>
                  <p className="text-xs text-gray-600 mt-0.5">2:00 PM - 3:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Employees */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            {/* Mock Donut Chart */}
            <div className="relative w-32 h-32 mb-6">
              <svg viewBox="0 0 36 36" className="w-32 h-32 circular-chart text-accent-500">
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
                 <span className="text-2xl font-bold text-navy-900">720</span>
                 <span className="text-xs text-gray-500">/ 1000</span>
              </div>
            </div>
            
            <div className="w-full space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent-500"></div>
                   <span className="text-gray-600">Onboarding</span>
                 </div>
                 <span className="font-semibold">32%</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-navy-300"></div>
                   <span className="text-gray-600">Offboarding</span>
                 </div>
                 <span className="font-semibold">18%</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns for Recruitment & Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recruitment Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Job Openings', value: '5', color: 'bg-emerald-100 text-emerald-600' },
               { label: 'New Candidates', value: '60', color: 'bg-blue-100 text-blue-600' },
               { label: 'Invited for Interview', value: '25', color: 'bg-amber-100 text-amber-600' },
               { label: 'Waiting for Feedback', value: '10', color: 'bg-purple-100 text-purple-600' },
             ].map((stat, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 mx-auto rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900">{stat.value}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
             ))}
          </div>

          {/* Ongoing Recruitment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
              <CardTitle>Ongoing recruitment</CardTitle>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Job</th>
                      <th className="px-6 py-3 font-semibold">Total candidates</th>
                      <th className="px-6 py-3 font-semibold">Stage</th>
                      <th className="px-6 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy-900">Senior Designer</td>
                      <td className="px-6 py-4 text-gray-600">30</td>
                      <td className="px-6 py-4">
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-accent-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-700" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy-900">Developer</td>
                      <td className="px-6 py-4 text-gray-600">45</td>
                      <td className="px-6 py-4">
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-accent-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-700" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          {/* To-Do List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
              <CardTitle>To-Do List</CardTitle>
              <Plus className="w-5 h-5 text-gray-400 cursor-pointer" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { text: 'Review performance goals', done: false },
                { text: 'Approve timesheets', done: true },
                { text: 'Welcome new team members', done: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked={task.done} className="w-4 h-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500" />
                  <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{task.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-blue-600 flex items-center justify-center font-bold text-xs">SM</div>
                   <div>
                     <p className="text-sm font-semibold text-navy-900">Sarah Miller</p>
                     <p className="text-xs text-gray-500">Annual Leave</p>
                   </div>
                 </div>
                 <Badge variant="warning">Pending</Badge>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#FEE2E2] text-red-600 flex items-center justify-center font-bold text-xs">AJ</div>
                   <div>
                     <p className="text-sm font-semibold text-navy-900">Alex Johnson</p>
                     <p className="text-xs text-gray-500">Expense Report</p>
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

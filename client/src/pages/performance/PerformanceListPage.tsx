import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'My Performance' | 'Team Performance Summary';

export default function PerformanceListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('My Performance');
  
  // Mock data structure matching the timeline view from Visily Page 8
  const timelineData = [
    {
      year: '2023',
      reviews: [
        { title: 'Annual Performance Review 2023', employee: 'David Smith', date: 'Dec 01 - Dec 15, 2023', period: '2023', status: 'In Progress' },
        { title: 'Q3 Performance Review', employee: 'David Smith', date: 'Oct 01 - Oct 15, 2023', period: 'Q3 2023', status: 'Completed' },
        { title: 'Mid-year Performance Review', employee: 'David Smith', date: 'Jul 01 - Jul 15, 2023', period: 'Mid-year 2023', status: 'Completed' },
      ]
    },
    {
      year: '2022',
      reviews: [
        { title: 'Annual Performance Review 2022', employee: 'David Smith', date: 'Dec 01 - Dec 15, 2022', period: '2022', status: 'Closed' },
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'In Progress': return <Badge variant="info">In Progress</Badge>;
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'Closed': return <Badge variant="default">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Performance</h1>
        
        <div className="flex bg-gray-100 p-1 rounded-full w-full sm:w-auto">
          {(['My Performance', 'Team Performance Summary'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-1 sm:flex-none text-center",
                activeTab === tab 
                  ? "bg-white text-navy-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            placeholder="Search reviews..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          />
        </div>
        
        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
          <option>All Types</option>
        </select>
        
        <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
          <option>All Status</option>
        </select>

        <button className="text-sm text-gray-500 hover:text-navy-900 underline underline-offset-2">
          Clear filters
        </button>
      </div>

      {/* Timeline View */}
      <div className="max-w-4xl pt-4 animate-in fade-in">
        <div className="relative border-l-2 border-gray-100 ml-4 space-y-12">
          
          {timelineData.map((group) => (
            <div key={group.year} className="relative">
              {/* Year Marker */}
              <div className="absolute -left-[35px] top-0 bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-full h-16 w-16 flex items-center justify-center shadow-sm">
                {group.year}
              </div>
              
              <div className="pl-16 space-y-6 pt-2">
                {group.reviews.map((review, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow relative">
                    {/* Status dot connection */}
                    <div className="absolute top-8 -left-[4.5rem] w-8 border-t-2 border-gray-100 border-dashed"></div>
                    <div className="absolute top-7 -left-[4.8rem] h-3 w-3 rounded-full bg-gray-200 ring-4 ring-white"></div>

                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-navy-900">{review.title}</h3>
                            {getStatusBadge(review.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-0.5">Employee</p>
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-[10px]">
                                  {review.employee.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <span className="font-medium text-navy-900">{review.employee}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-0.5">Date</p>
                              <p className="font-medium text-navy-900">{review.date}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-0.5">Review period</p>
                              <p className="font-medium text-navy-900">{review.period}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="shrink-0 flex items-center">
                          <Button variant="outline" className="text-accent-600 border-accent-200 hover:bg-accent-50">
                            View details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

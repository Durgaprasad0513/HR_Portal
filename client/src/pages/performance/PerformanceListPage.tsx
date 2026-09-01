import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'My Performance' | 'Team Performance Summary';

import { useQuery } from '@tanstack/react-query';
import { performanceApi } from '@/api/performance';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PerformanceListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('My Performance');
  
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['performance', activeTab],
    queryFn: () => activeTab === 'My Performance' ? performanceApi.getMyReviews().then(res => res.data) : performanceApi.getAll().then(res => res.data)
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DRAFT': return <Badge variant="default">Draft</Badge>;
      case 'SELF_SUBMITTED': return <Badge variant="info">Self Appraised</Badge>;
      case 'MANAGER_SUBMITTED': return <Badge variant="warning">Manager Appraised</Badge>;
      case 'APPROVAL_APPROVED': return <Badge variant="success">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">Performance</h1>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-full sm:w-auto">
          {(['My Performance', 'Team Performance Summary'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-colors flex-1 sm:flex-none text-center",
                activeTab === tab 
                  ? "bg-white dark:bg-gray-900 text-navy-900 dark:text-white shadow-sm" 
                  : "text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300"
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input 
            placeholder="Search reviews..." 
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          />
        </div>
        
        <select className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500">
          <option>All Types</option>
        </select>
        
        <select className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500">
          <option>All Status</option>
        </select>

        <button className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-navy-900 dark:text-white underline underline-offset-2">
          Clear filters
        </button>
      </div>

      {/* Timeline View */}
      <div className="max-w-4xl pt-4 animate-in fade-in">
        <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-4 space-y-6 pl-12">
          {isLoading ? (
            <LoadingSpinner />
          ) : !reviews || reviews.length === 0 ? (
            <div className="p-8 text-gray-500 dark:text-gray-400 dark:text-gray-500">No performance reviews found.</div>
          ) : (
            reviews.map((review: any) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow relative">
                <div className="absolute top-8 -left-[3.5rem] w-6 border-t-2 border-gray-100 dark:border-gray-800 border-dashed"></div>
                <div className="absolute top-7 -left-[3.8rem] h-3 w-3 rounded-full bg-gray-200 ring-4 ring-white"></div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-navy-900 dark:text-white">{review.reviewPeriod} Review</h3>
                        {getStatusBadge(review.finalApprovalStatus || 'DRAFT')}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-0.5">Employee</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-navy-900 dark:text-white">
                              {review.employee ? `${review.employee.firstName} ${review.employee.lastName}` : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-0.5">Self Rating</p>
                          <p className="font-medium text-navy-900 dark:text-white">{review.selfRating || '-'}/5</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-0.5">Manager Rating</p>
                          <p className="font-medium text-navy-900 dark:text-white">{review.managerRating || '-'}/5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useQuery
if 'useQuery' not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useQuery } from '@tanstack/react-query';\nimport { recruitmentApi } from '@/api/recruitment';\nimport { LoadingSpinner } from '@/components/ui/LoadingSpinner';\nimport { formatDate, formatDateTime } from '@/utils/dateFormat';")

# Add the query and rendering
query_code = """
  const { data: interviewsData, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => recruitmentApi.getInterviews().then(res => res.data)
  });
"""

content = content.replace(
    '  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);',
    '  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);\n' + query_code
)

# Render
list_render = """
              <tbody className="divide-y divide-slate-border">
                {isLoading ? (
                  <tr><td colSpan={7} className="py-10"><LoadingSpinner /></td></tr>
                ) : interviewsData && interviewsData.length > 0 ? (
                  interviewsData.map((cand: any) => (
                    <tr key={cand.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{cand.candidateName}</p>
                        <p className="text-xs text-slate-500">{cand.requisition?.title || 'Unknown Role'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {cand.interviewDate ? formatDateTime(cand.interviewDate) : 'Not Scheduled'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        In-person
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {cand.interviewer ? `${cand.interviewer.firstName} ${cand.interviewer.lastName}` : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {cand.interviewRound || 'Round 1'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => {}} className="text-slate-400 hover:text-indigo-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                          <CalendarIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No interviews scheduled</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                          There are currently no interviews awaiting conduct. Click the button below to schedule one.
                        </p>
                        <Button onClick={() => setIsScheduleModalOpen(true)} className="rounded-xl shadow-sm">
                          Schedule Interview
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
"""

# Replace the tbody
content = re.sub(r'<tbody className="divide-y divide-slate-border">.*?</tbody>', list_render, content, flags=re.DOTALL)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Calendar UI")

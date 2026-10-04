import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Calendar import if not present
if "import { Calendar" not in content:
    content = content.replace(
        "import { PageHeader }",
        "import { Calendar as CalendarPicker } from '@/components/ui/Calendar';\nimport { isSameDay } from 'date-fns';\nimport { PageHeader }"
    )

# Add selectedDate state
if "const [selectedDate" not in content:
    content = content.replace(
        "const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');",
        "const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');\n  const [selectedDate, setSelectedDate] = useState<Date>(new Date());"
    )

calendar_view_code = """
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-border">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center">
              <CalendarPicker value={selectedDate} onChange={setSelectedDate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm" />
            </div>
            <div className="md:col-span-2 p-6">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                Interviews on {formatDate(selectedDate.toISOString())}
              </h3>
              <div className="space-y-4">
                {interviewsData && interviewsData.filter((cand: any) => cand.interviewDate && isSameDay(new Date(cand.interviewDate), selectedDate)).length > 0 ? (
                  interviewsData.filter((cand: any) => cand.interviewDate && isSameDay(new Date(cand.interviewDate), selectedDate)).map((cand: any) => (
                    <div key={cand.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{cand.candidateName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {cand.interviewRound || 'Round 1'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{cand.requisition?.positionTitle || 'Unknown Role'}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {formatDateTime(cand.interviewDate)}</span>
                          <span className="flex items-center gap-1.5">Panel: {cand.interviewer ? `${cand.interviewer.firstName} ${cand.interviewer.lastName}` : 'Unassigned'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                      <CalendarDays className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white">No interviews</p>
                    <p className="text-sm text-slate-500">There are no interviews scheduled for this date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
"""

# Replace the hardcoded calendar view
old_calendar_view = """          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Calendar View</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Calendar integration is ready to be configured. Switch back to List view to manage active schedules.
            </p>
          </div>"""

content = content.replace(old_calendar_view, calendar_view_code)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Calendar View")

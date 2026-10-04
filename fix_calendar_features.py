import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useMutation for updating candidate
if "const queryClient =" not in content:
    content = content.replace(
        "const { data: interviewsData",
        "const queryClient = useQueryClient();\n  const { data: interviewsData"
    )

if "import { useMutation, useQueryClient" not in content:
    content = content.replace(
        "import { useQuery } from '@tanstack/react-query';",
        "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';"
    )

mutation_code = """
  const updateCandidateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => recruitmentApi.interviewCandidate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    }
  });

  const handleMarkFinish = (id: string) => {
    updateCandidateMutation.mutate({ id, payload: { interviewFeedback: 'Finished' } });
  };

  const handleSetPhase = (id: string, phase: string) => {
    updateCandidateMutation.mutate({ id, payload: { interviewRound: phase } });
  };
"""

content = content.replace(
    "  const { data: interviewsData, isLoading } = useQuery({",
    mutation_code + "\n  const { data: interviewsData, isLoading } = useQuery({"
)

# Update the Table row rendering
table_row_regex = r'<tr key=\{cand\.id\}.*?</tr>'
# Wait, it's multiline. Let's just find and replace the specific TD blocks.

# 1. Round column
content = content.replace(
    "{cand.interviewRound || 'Round 1'}",
    "{cand.interviewRound ? cand.interviewRound.replace('_', ' ') : 'HR INTERVIEW'}"
)

# 2. Status column
status_col_old = """                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                        </span>
                      </td>"""

status_col_new = """                      <td className="px-6 py-4">
                        {cand.interviewFeedback === 'Finished' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Finished
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleMarkFinish(cand.id)}
                            disabled={updateCandidateMutation.isPending}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                          >
                            <CalendarDays className="w-3.5 h-3.5" /> Scheduled
                          </button>
                        )}
                      </td>"""
content = content.replace(status_col_old, status_col_new)

# 3. Actions column
# We need a dropdown for actions. But we can just use a simple relative dropdown or standard select if they don't have a DropdownMenu component.
# Let's check if there is a Select component in ui. Yes, we imported Select! Wait, Select is a custom component, we can just use a native <select> for simplicity, or we can render buttons.
# Let's render a native <select> styled nicely for the Phase.

actions_col_old = """                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => {}} className="text-slate-400 hover:text-indigo-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>"""

actions_col_new = """                      <td className="px-6 py-4 text-right">
                        <select 
                          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none cursor-pointer text-slate-700 dark:text-slate-300"
                          value={cand.interviewRound || 'HR_INTERVIEW'}
                          onChange={(e) => handleSetPhase(cand.id, e.target.value)}
                          disabled={updateCandidateMutation.isPending}
                        >
                          <option value="TELEPHONIC">Telephonic</option>
                          <option value="HR_INTERVIEW">HR Interview</option>
                          <option value="TECHNICAL">Technical</option>
                          <option value="MANAGEMENT">Management</option>
                          <option value="OFFER">Offer Stage</option>
                        </select>
                      </td>"""
content = content.replace(actions_col_old, actions_col_new)

# 4. We also need to update the calendar view part!
# The calendar view renders a list of interviews too.
cal_round_old = "{cand.interviewRound || 'Round 1'}"
cal_round_new = "{cand.interviewRound ? cand.interviewRound.replace('_', ' ') : 'HR INTERVIEW'}"
content = content.replace(cal_round_old, cal_round_new)

cal_button_old = """                      <div className="flex flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm">Details</Button>
                      </div>"""
cal_button_new = """                      <div className="flex flex-col gap-2 shrink-0 items-end">
                        {cand.interviewFeedback === 'Finished' ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Finished</span>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleMarkFinish(cand.id)} disabled={updateCandidateMutation.isPending}>Mark Finish</Button>
                        )}
                        <select 
                          className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-1 py-0.5 outline-none cursor-pointer max-w-[120px]"
                          value={cand.interviewRound || 'HR_INTERVIEW'}
                          onChange={(e) => handleSetPhase(cand.id, e.target.value)}
                          disabled={updateCandidateMutation.isPending}
                        >
                          <option value="TELEPHONIC">Telephonic</option>
                          <option value="HR_INTERVIEW">HR Interview</option>
                          <option value="TECHNICAL">Technical</option>
                          <option value="MANAGEMENT">Management</option>
                          <option value="OFFER">Offer</option>
                        </select>
                      </div>"""
content = content.replace(cal_button_old, cal_button_new)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Calendar Features")

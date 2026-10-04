import os

filepath = 'client/src/pages/recruitment/RecruitmentPage.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add trackerMode state
if "const [trackerMode, setTrackerMode]" not in content:
    content = content.replace(
        "const [selectedBoardReqId, setSelectedBoardReqId] = useState<string | null>(null);",
        "const [selectedBoardReqId, setSelectedBoardReqId] = useState<string | null>(null);\n const [trackerMode, setTrackerMode] = useState<'kanban' | 'table'>('kanban');"
    )

# Replace the flex block rendering both Kanban and Table with the toggle logic
old_block = """           <div className="flex flex-col gap-6">
            <KanbanBoard 
              items={data.filter((req: any) => req.id === selectedBoardReqId).map((req: any) => ({
                id: req.id,
                title: req.positionTitle,
                subtitle: req.department?.name || req.location,
                status: req.status, // maps directly to the Kanban stages
                originalData: req
              }))} 
              onStatusChange={handleStatusChange} 
              onItemClick={(item) => setSelectedReq(item.originalData)}
            />
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-heading text-lg">Candidates Pipeline</h3>
                {canExport('recruitment') && (
                  <Button variant="outline" onClick={handleExportCandidates}>
                    <Download className="w-4 h-4 mr-2" /> Export Register
                  </Button>
                )}
              </div>
              {isCandidatesLoading ? (
                <div className="py-12"><LoadingSpinner /></div>
              ) : (
                <div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface text-gray-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">Candidate Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-border">
                      {candidatesData?.map((c: any) => (
                        <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium text-navy-900 dark:text-white">{c.candidateName}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.email}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.selectionStatus || c.screeningStatus || 'APPLIED'}</td>
                        </tr>
                      ))}
                      {!candidatesData?.length && (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No candidates found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>"""

new_block = """           <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <button 
                  onClick={() => setTrackerMode('kanban')} 
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${trackerMode === 'kanban' ? 'bg-white dark:bg-surface shadow-sm text-accent-600 dark:text-accent-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  Board View
                </button>
                <button 
                  onClick={() => setTrackerMode('table')} 
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${trackerMode === 'table' ? 'bg-white dark:bg-surface shadow-sm text-accent-600 dark:text-accent-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  List View
                </button>
              </div>
              {canExport('recruitment') && trackerMode === 'table' && (
                <Button variant="outline" onClick={handleExportCandidates} className="shadow-sm">
                  <Download className="w-4 h-4 mr-2" /> Export Register
                </Button>
              )}
            </div>

            {trackerMode === 'kanban' ? (
              <KanbanBoard 
                items={data.filter((req: any) => req.id === selectedBoardReqId).map((req: any) => ({
                  id: req.id,
                  title: req.positionTitle,
                  subtitle: req.department?.name || req.location,
                  status: req.status, // maps directly to the Kanban stages
                  originalData: req
                }))} 
                onStatusChange={handleStatusChange} 
                onItemClick={(item) => setSelectedReq(item.originalData)}
              />
            ) : (
              <div className="mt-2">
                {isCandidatesLoading ? (
                  <div className="py-12"><LoadingSpinner /></div>
                ) : (
                  <div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Candidate Name</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Email</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-border">
                        {candidatesData?.map((c: any) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{c.candidateName}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{c.email}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                                {c.selectionStatus || c.screeningStatus || 'APPLIED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {!candidatesData?.length && (
                          <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">No candidates found in the pipeline.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
else:
    print("Could not find the block to replace")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated RecruitmentPage.tsx successfully")

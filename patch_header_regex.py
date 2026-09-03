import re

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r'(<div className="flex items-center gap-4">\s*<Button variant="ghost" onClick=\{\(\) => setSelectedReq\(null\)\} className="px-2">\s*<ChevronLeft className="w-5 h-5" />\s*</Button>\s*<div>\s*<h2 className="text-xl font-bold text-navy-900 dark:text-white">\{selectedReq\.positionTitle\}</h2>\s*<p className="text-sm text-gray-500 dark:text-gray-400">HR Funnel Layout Structure</p>\s*</div>\s*</div>)', re.DOTALL)

new_header = """<div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setSelectedReq(null)} className="px-2">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-navy-900 dark:text-white">{selectedReq.positionTitle}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">HR Funnel Layout Structure</p>
                </div>
              </div>
              {canExport('recruitment') && (
                <Button variant="outline" onClick={handleExportCandidates}>
                  <Download className="w-4 h-4 mr-2" /> Export Register
                </Button>
              )}
            </div>"""

if pattern.search(content):
    content = pattern.sub(new_header, content)
    with open("client/src/pages/recruitment/RecruitmentPage.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully patched header!")
else:
    print("Pattern not found!")

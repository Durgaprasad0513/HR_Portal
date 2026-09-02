import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

cards_html = """
      {isAdminOrHR && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{data.filter((d:any) => d.approvalStatus === 'APPROVAL_PENDING').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Awaiting Settlement</p>
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{data.filter((d:any) => d.settlementStatus === 'SUBMITTED').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Settled Expenses</p>
            <p className="text-2xl font-bold text-navy-900 dark:text-white">
              ₹{data.filter((d:any) => d.settlementStatus === 'SETTLED').reduce((sum:number, d:any) => sum + Number(d.totalExpenseClaimed || 0), 0)}
            </p>
          </div>
        </div>
      )}

      <div className="animate-in fade-in">"""

content = content.replace('      <div className="animate-in fade-in">', cards_html)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added dashboard cards to TravelListPage")

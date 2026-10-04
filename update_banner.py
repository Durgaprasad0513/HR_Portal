import re

with open('client/src/pages/dashboard/components/ProfileBanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
if 'Receipt' not in content:
    content = content.replace("import { Calendar, Plane, MessageSquare } from 'lucide-react';", 
                              "import { Calendar, Plane, MessageSquare, Receipt } from 'lucide-react';")

# 2. Add the button
hr_query_button = """          <button 
            onClick={() => navigate('/requests')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            HR Query
          </button>"""

expense_button = """          <button 
            onClick={() => navigate('/office-expenses')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            <Receipt className="w-4 h-4" />
            Submit Expense
          </button>"""

content = content.replace(hr_query_button, hr_query_button + "\n" + expense_button)

with open('client/src/pages/dashboard/components/ProfileBanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ProfileBanner.tsx")

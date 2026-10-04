import re

with open('client/src/pages/dashboard/components/ProfileBanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

expense_button = """        <button 
          onClick={() => navigate('/office-expenses')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <Receipt className="w-4 h-4" />
          Submit Expense
        </button>
      </div>"""

content = content.replace("        </button>\n      </div>", "        </button>\n" + expense_button)

with open('client/src/pages/dashboard/components/ProfileBanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ProfileBanner.tsx 3rd try")

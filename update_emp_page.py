import re

filepath = 'client/src/pages/employees/EmployeeDetailPage.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'DigitalIDCardModal' not in content:
    content = content.replace(
        "import { formatDate } from '@/utils/dateFormat';",
        "import { formatDate } from '@/utils/dateFormat';\nimport { DigitalIDCardModal } from './components/DigitalIDCardModal';"
    )

# 2. Add state
if 'isDigitalIDModalOpen' not in content:
    content = content.replace(
        "const queryClient = useQueryClient();",
        "const queryClient = useQueryClient();\n  const [isDigitalIDModalOpen, setIsDigitalIDModalOpen] = useState(false);"
    )

# 3. Replace the static pill with a button
old_pill = '''              <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30 whitespace-nowrap">
                <QrCode className="w-3.5 h-3.5" /> Digital ID Card & QR Pass
              </div>'''

new_button = '''              <button 
                onClick={() => setIsDigitalIDModalOpen(true)}
                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30 whitespace-nowrap transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" /> Digital ID Card & QR Pass
              </button>'''

if old_pill in content:
    content = content.replace(old_pill, new_button)
else:
    print("Could not find the pill to replace.")

# 4. Insert Modal at the end of the return statement before the closing div
if '<DigitalIDCardModal' not in content:
    # Let's find the closing tag of the main layout, wait, it's easier to inject right before `</div>` which is the last line or before `</>`
    # The return statement is wrapped in <div className="space-y-6 ...">
    
    # We can inject it right before `</div>\n  );\n}`
    idx = content.rfind("</div>")
    if idx != -1:
        content = content[:idx] + "      {emp && <DigitalIDCardModal isOpen={isDigitalIDModalOpen} onClose={() => setIsDigitalIDModalOpen(false)} employee={emp} />}\n    " + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated EmployeeDetailPage.tsx")

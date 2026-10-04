import os

filepath = 'client/src/components/layout/Header.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Import
if 'DigitalIDCardModal' not in content:
    content = content.replace(
        "import { CommandPalette } from '../ui/CommandPalette';",
        "import { CommandPalette } from '../ui/CommandPalette';\nimport { DigitalIDCardModal } from '@/pages/employees/components/DigitalIDCardModal';"
    )
    # also add QrCode to lucide-react imports if not there
    if 'QrCode' not in content:
        content = content.replace("LogOut", "LogOut, QrCode")

# 2. Add State
if 'isDigitalIDModalOpen' not in content:
    content = content.replace(
        "const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);",
        "const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);\n  const [isDigitalIDModalOpen, setIsDigitalIDModalOpen] = useState(false);"
    )

# 3. Add Button
old_btn = ''' <User className="mr-2 h-4 w-4" /> Profile
 </button>'''

new_btn = ''' <User className="mr-2 h-4 w-4" /> Profile
 </button>
 
 {user?.employee && (
   <button
     className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
     onClick={() => {
       setDropdownOpen(false);
       setIsDigitalIDModalOpen(true);
     }}
   >
     <QrCode className="mr-2 h-4 w-4" /> Digital ID Card
   </button>
 )}'''

if old_btn in content:
    content = content.replace(old_btn, new_btn)

# 4. Add Modal Component at the end
old_end = ''' </header>
   <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
   
   <ConfirmDialog'''

new_end = ''' </header>
   <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
   
   {user?.employee && (
     <DigitalIDCardModal 
       isOpen={isDigitalIDModalOpen} 
       onClose={() => setIsDigitalIDModalOpen(false)} 
       employee={user.employee as any} 
     />
   )}
   
   <ConfirmDialog'''

if old_end in content:
    content = content.replace(old_end, new_end)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Header.tsx")

import re

with open("client/src/components/layout/Header.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Profile fallback and remove Settings button
old_settings_block = """                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setDropdownOpen(false);
                    const empId = user?.employeeId || (user as any)?.employee?.id;
                    if (empId) {
                      navigate(`/employees/${empId}`);
                    } else {
                      // Fallback for users without an employee record (like system admins)
                      navigate('/settings');
                    }
                  }} 
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </button>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }} 
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </button>"""

new_settings_block = """                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setDropdownOpen(false);
                    const empId = user?.employeeId || (user as any)?.employee?.id;
                    if (empId) {
                      navigate(`/employees/${empId}`);
                    } else {
                      // Admin without employee record
                      navigate('/roles');
                    }
                  }} 
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </button>"""

content = content.replace(old_settings_block, new_settings_block)

# Also remove Settings icon import to avoid lint error
content = content.replace("Settings, ", "")
content = content.replace(", Settings", "")
content = content.replace("Settings }", "}")

with open("client/src/components/layout/Header.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed references to /settings in Header.tsx")

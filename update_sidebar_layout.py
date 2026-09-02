import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove Dashboard from workspaceNav
content = content.replace("    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },\n", "")

# Reorder sections
old_sections = """  const sections = [
    { id: 'workspace', title: 'Workspace', items: workspaceNav, icon: LayoutDashboard },
    { id: 'employees', title: 'Employees', items: employeesNav, icon: Users },
    { id: 'expenses', title: 'Expenses', items: expensesNav, icon: CreditCard },
    ...(authNav.length > 0 ? [{ id: 'auth', title: 'Authorization', items: authNav, icon: Shield }] : []),
  ];"""

new_sections = """  const sections = [
    { id: 'employees', title: 'Employees', items: employeesNav, icon: Users },
    { id: 'workspace', title: 'Workspace', items: workspaceNav, icon: LayoutDashboard },
    { id: 'expenses', title: 'Expenses', items: expensesNav, icon: CreditCard },
    ...(authNav.length > 0 ? [{ id: 'auth', title: 'Authorization', items: authNav, icon: Shield }] : []),
  ];"""

content = content.replace(old_sections, new_sections)

# Add Dashboard NavLink above sections.map
old_render = """      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-2 custom-scrollbar">
        {sections.map((section) => {"""

new_render = """      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-2 custom-scrollbar">
        <NavLink
          to="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
            location.pathname === '/dashboard' ? "text-[#f39c12] bg-white/5" : "text-white/80 hover:text-[#f39c12]"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>

        {sections.map((section) => {"""

content = content.replace(old_render, new_render)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Sidebar.tsx layout")

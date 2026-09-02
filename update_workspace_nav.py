import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_nav = """  const workspaceNav = [
    { name: 'Assets', path: '/assets', icon: Laptop },
    { name: 'Recruitment', path: '/recruitment', icon: Briefcase },
    { name: 'HR Helpdesk', path: '/requests', icon: ClipboardList },
    { name: 'Documents', path: '/documents', icon: Files },
    ...(isAdminOrHR ? [
      { name: 'Reports', path: '/reports', icon: BarChart },
      { name: 'Attrition', path: '/attrition', icon: UserMinus },
    ] : [])
  ];"""

new_nav = """  const workspaceNav = [
    { name: 'Recruitment', path: '/recruitment', icon: Briefcase },
    { name: 'Assets', path: '/assets', icon: Laptop },
    ...(isAdminOrHR ? [{ name: 'Attrition', path: '/attrition', icon: UserMinus }] : []),
    { name: 'Documents', path: '/documents', icon: Files },
    { name: 'Helpdesk', path: '/requests', icon: ClipboardList },
    ...(isAdminOrHR ? [{ name: 'Reports', path: '/reports', icon: BarChart }] : [])
  ];"""

content = content.replace(old_nav, new_nav)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Workspace items order")

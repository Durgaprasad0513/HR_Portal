import re

with open('client/src/pages/dashboard/components/EmployeeDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace BoxReveal to add width="100%" className="h-full"
# Currently: <BoxReveal duration={0.6} disabled={!shouldAnimate}>
content = re.sub(r'<BoxReveal (.*?)>', r'<BoxReveal \1 width="100%" className="h-full">', content)

# But wait, we might have already width="100%" if it was added manually. 
# We can just replace `<BoxReveal ` with `<BoxReveal width="100%" className="h-full" ` and it will override or just add them.
# Better to do it safely.

with open('client/src/pages/dashboard/components/EmployeeDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated EmployeeDashboard")

import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '<span className="text-xl font-bold tracking-wide">My-Task</span>',
    '<span className="text-xl font-bold tracking-wide">HR Management</span>'
)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated branding text")

import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "{ name: 'Office', path: '#', icon: Building2 },",
    "{ name: 'Office', path: '/office-expenses', icon: Building2 },"
)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Sidebar routing")

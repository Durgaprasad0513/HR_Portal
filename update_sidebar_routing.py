import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Office stub route
content = content.replace("href: '/expenses/office'", "href: '/office-expenses'")

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Sidebar routing")

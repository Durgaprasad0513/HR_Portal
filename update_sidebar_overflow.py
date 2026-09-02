import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add overflow-hidden to the text elements
content = content.replace('"whitespace-nowrap transition-all duration-300"', '"whitespace-nowrap overflow-hidden transition-all duration-300"')
content = content.replace('"text-xl font-bold tracking-wide whitespace-nowrap transition-all duration-300"', '"text-xl font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300"')

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added overflow-hidden to Sidebar text")

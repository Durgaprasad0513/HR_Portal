import re

with open("client/src/components/layout/MainLayout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("17.5rem", "18rem")

with open("client/src/components/layout/MainLayout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated 18rem")

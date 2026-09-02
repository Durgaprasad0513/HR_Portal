import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the broken key attribute
broken_key = r'key=<span className=\{cn\("whitespace-nowrap overflow-hidden transition-all duration-300", collapsed \? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100"\)\}>\{item\.name\}</span>'
content = re.sub(broken_key, 'key={item.name}', content)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed broken key in Sidebar.tsx")

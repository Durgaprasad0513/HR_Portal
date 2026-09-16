import re

files = [
    "client/src/components/ui/Button.tsx",
    "client/src/components/ui/DataTable.tsx"
]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove focus-visible:ring-* and focus-visible:ring-offset-*
    content = re.sub(r'focus-visible:ring-\S+', '', content)
    content = re.sub(r'focus:ring-\S+', '', content)
    
    # Also remove focus-visible:outline-none just in case, or leave it
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print("Rings removed from components")

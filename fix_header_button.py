import re

with open("client/src/components/layout/Header.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the old button with the new working button
old_button = r'<Button variant="ghost" size="sm" className="md:hidden mr-2">\s*<Menu className="h-5 w-5" />\s*</Button>'
new_button = """<Button variant="ghost" size="sm" className="mr-2 text-gray-500 hover:text-navy-900 dark:text-gray-400 dark:hover:text-white" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>"""

content = re.sub(old_button, new_button, content)

with open("client/src/components/layout/Header.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed Header.tsx button")

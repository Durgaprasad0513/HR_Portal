import re

with open("client/src/components/layout/Header.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add interface and props
content = content.replace("export function Header() {", "export function Header({ onMenuClick }: { onMenuClick?: () => void }) {")

# Find the start of the return statement
return_stmt = r'  return \(\n    <header className="bg-transparent border-none py-3 px-6 shrink-0 z-10">\n      <div className="flex items-center justify-between">'
new_return_stmt = """  return (
    <header className="bg-transparent border-none py-3 px-4 lg:px-6 shrink-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-navy-900 dark:text-gray-400 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>"""

content = re.sub(return_stmt, new_return_stmt, content)

with open("client/src/components/layout/Header.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Header.tsx")

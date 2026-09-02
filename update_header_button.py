import re

with open("client/src/components/layout/Header.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove lg:hidden from the menu button
old_button = 'className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-navy-900 dark:text-gray-400 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"'
new_button = 'className="p-2 -ml-2 text-gray-500 hover:text-navy-900 dark:text-gray-400 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"'

content = content.replace(old_button, new_button)

with open("client/src/components/layout/Header.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Header.tsx menu button")

import re

with open("client/src/components/layout/Header.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the Settings button from the dropdown
old_button = """                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </button>"""

content = content.replace(old_button, "")

# Remove the Settings icon import if it's there
content = content.replace("Settings, ", "")
content = content.replace(", Settings", "")

with open("client/src/components/layout/Header.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed Settings from Header.tsx")

import re

with open("client/src/routes/AppRoutes.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the import and route
content = re.sub(r"import SettingsPage from '@/pages/settings/SettingsPage';\n", "", content)
content = re.sub(r"\s*<Route path=\"/settings\" element={<SettingsPage />} />", "", content)

with open("client/src/routes/AppRoutes.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed Settings from AppRoutes.tsx")

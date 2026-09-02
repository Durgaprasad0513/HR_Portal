import re

with open("client/src/pages/roles/RoleManagementPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("await apiClient.get('/roles')", "await apiClient.get('/permissions')")
content = content.replace("await apiClient.patch('/roles'", "await apiClient.patch('/permissions'")

with open("client/src/pages/roles/RoleManagementPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched RoleManagementPage.tsx")

with open("client/src/hooks/usePermissions.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("await apiClient.get('/roles/my')", "await apiClient.get('/permissions/my')")

with open("client/src/hooks/usePermissions.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched usePermissions.ts")

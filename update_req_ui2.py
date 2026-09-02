import re

with open("client/src/pages/requests/RequestListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "const { data } = await apiClient.get('/employees');",
    "const { data } = await apiClient.get('/requests/staff');"
).replace(
    """{admins?.data?.filter((e: any) => e.user?.role === 'ADMIN' || e.user?.role === 'HR').map((e: any) => (
                  <option key={e.user?.id} value={e.user?.id}>{e.firstName} {e.lastName}</option>
                ))}""",
    """{admins?.data?.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.employee?.firstName || 'Admin'} {u.employee?.lastName || ''} ({u.email})</option>
                ))}"""
)

with open("client/src/pages/requests/RequestListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated frontend admin query")

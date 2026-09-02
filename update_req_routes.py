import re

with open("server/src/modules/requests/request.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "router.get('/my-requests',",
    "router.get('/staff', requireStaffView('requests'), requestController.getStaffUsers);\nrouter.get('/my-requests',"
)

with open("server/src/modules/requests/request.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated request routes")

import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_submit = """    if (assignedEmployeeId) {
      payload.assignedEmployeeId = assignedEmployeeId;
      payload.status = 'IN_USE';
    }"""

new_submit = """    if (assignedEmployeeId) {
      payload.assignedEmployeeId = assignedEmployeeId;
      if (!editingAsset) payload.status = 'IN_USE';
    } else if (editingAsset) {
      payload.assignedEmployeeId = null;
    }"""

content = content.replace(old_submit, new_submit)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated submit handler")

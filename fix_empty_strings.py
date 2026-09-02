import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_code = """    if (assignedEmployeeId) {
      payload.assignedEmployeeId = assignedEmployeeId;
      if (!editingAsset) payload.status = 'IN_USE';
    } else if (editingAsset) {
      payload.assignedEmployeeId = null;
    }

    if (editingAsset) {"""

new_code = """    if (assignedEmployeeId) {
      payload.assignedEmployeeId = assignedEmployeeId;
      if (!editingAsset) payload.status = 'IN_USE';
    } else if (editingAsset) {
      payload.assignedEmployeeId = null;
    }

    Object.keys(payload).forEach(key => {
      if (payload[key] === '') delete payload[key];
    });

    if (editingAsset) {"""

content = content.replace(old_code, new_code)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added empty string cleanup")

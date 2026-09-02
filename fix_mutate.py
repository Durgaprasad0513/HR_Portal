import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_code = """    if (editingAsset) {
    } else {"""
new_code = """    if (editingAsset) {
      updateMutation.mutate(payload);
    } else {"""

content = content.replace(old_code, new_code)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Restored updateMutation.mutate(payload)")

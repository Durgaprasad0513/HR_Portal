import re

with open("server/src/modules/assets/asset.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

ownership_check = """
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isOwner = user?.employeeId === existing.assignedEmployeeId;
    const isEditor = user?.role === 'ADMIN' || user?.role === 'HR';
    if (!isOwner && !isEditor) throw new Error('You do not have permission to modify this asset.');"""

def insert_check(content, method_name):
    target = f"if (!existing.assignedEmployeeId) throw new Error('Asset is not currently assigned.');"
    replacement = target + ownership_check
    # We only want to replace it inside the method, but string replace is fine if we limit it
    parts = content.split(f"async {method_name}")
    if len(parts) == 2:
        parts[1] = parts[1].replace(target, replacement, 1)
        return parts[0] + f"async {method_name}" + parts[1]
    return content

content = insert_check(content, "returnAsset")
content = insert_check(content, "reportAssetDamage")
content = insert_check(content, "reportAssetLost")

with open("server/src/modules/assets/asset.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Added ownership checks")

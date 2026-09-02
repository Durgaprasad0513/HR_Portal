import re

def fix_types(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the CurrentUser interface to allow string role
    content = content.replace("role: Role;", "role: Role | string;")
    
    # Remove rejectionReason from travel.service.ts because it's not in schema
    if "rejectionReason" in content:
        content = content.replace("rejectionReason: data.rejectionReason,", "")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_types('server/src/modules/travel/travel.service.ts')
fix_types('server/src/modules/assets/asset.service.ts')

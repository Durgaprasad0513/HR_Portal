import re

def fix_types_round2(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the CurrentUser interface to allow string | null employeeId
    content = content.replace("employeeId?: string;", "employeeId?: string | null;")
    
    # getModuleScope(currentUser.role as Role, ...)
    content = content.replace("getModuleScope(currentUser.role, 'assets')", "getModuleScope(currentUser.role as Role, 'assets')")
    content = content.replace("getModuleScope(currentUser.role, 'travel')", "getModuleScope(currentUser.role as Role, 'travel')")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_types_round2('server/src/modules/travel/travel.service.ts')
fix_types_round2('server/src/modules/assets/asset.service.ts')

import re

def fix_types_round3(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The issue is that currentUser.employeeId can be null, but Prisma queries expect string or undefined.
    # We should cast currentUser.employeeId! in the queries where we already checked if it exists,
    # or handle it dynamically.
    
    # In asset.service.ts and travel.service.ts, replace `employeeId: currentUser.employeeId` with `employeeId: currentUser.employeeId!`
    content = content.replace("employeeId: currentUser.employeeId }", "employeeId: currentUser.employeeId! }")
    content = content.replace("id: currentUser.employeeId }", "id: currentUser.employeeId! }")
    content = content.replace("managerId: currentUser.employeeId }", "managerId: currentUser.employeeId! }")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_types_round3('server/src/modules/travel/travel.service.ts')
fix_types_round3('server/src/modules/assets/asset.service.ts')

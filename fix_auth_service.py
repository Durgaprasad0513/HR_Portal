import re

path = "server/src/modules/auth/auth.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix getMe
get_me_bad_block = """
    // Log successful login
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: reqContext.ipAddress,
        deviceBrowser: reqContext.deviceBrowser,
      }
    });

    const permissions = await permissionService.getForRole(user.role);"""

# Replace ONLY the second occurrence, or replace using regex within getMe
content = re.sub(r"async getMe[\s\S]*?\}", lambda m: m.group(0).replace(get_me_bad_block, "\n    const permissions = await permissionService.getForRole(user.role);"), content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

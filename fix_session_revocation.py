import re

# Update jwt.ts
path = "server/src/utils/jwt.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("employeeId: string | null;", "employeeId: string | null;\n  tokenVersion: number;")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update auth.service.ts
path = "server/src/modules/auth/auth.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("employeeId: user.employeeId,", "employeeId: user.employeeId,\n      tokenVersion: user.tokenVersion,")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update auth.middleware.ts
path = "server/src/middleware/auth.middleware.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    if (!user || !user.isActive) {
      sendError(res, 'Account deactivated or invalid.', 401);
      return;
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      sendError(res, 'Session revoked. Please log in again.', 401);
      return;
    }"""

content = re.sub(r"    if \(!user \|\| !user\.isActive\) \{[\s\S]*?\}", replacement, content, count=1)
content = re.sub(r"\s*// You could also check tokenVersion here if it was encoded in the token,\s*// e.g., if \(user\.tokenVersion !== decoded\.tokenVersion\)\s*", "\n\n", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

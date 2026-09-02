import re

# Update auth.service.ts
path = "server/src/modules/auth/auth.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("async login(input: LoginInput) {", "async login(input: LoginInput, reqContext: { ipAddress?: string, deviceBrowser?: string } = {}) {")

# Insert login history logic
login_success_code = """
    // Log successful login
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: reqContext.ipAddress,
        deviceBrowser: reqContext.deviceBrowser,
      }
    });

    const permissions = await permissionService.getForRole(user.role);"""

content = content.replace("const permissions = await permissionService.getForRole(user.role);", login_success_code)

# For wrong password:
wrong_pw_replace = """    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      await prisma.auditLog.create({
        data: {
          actionPerformed: 'FAILED_LOGIN',
          moduleAffected: 'auth',
          userId: user.id,
          ipAddress: reqContext.ipAddress,
        }
      });
      throw new Error('Invalid email or password');
    }"""
content = re.sub(r"    const isPasswordValid = await comparePassword\(input\.password, user\.password\);\n    if \(!isPasswordValid\) \{\n      throw new Error\('Invalid email or password'\);\n    \}", wrong_pw_replace, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update auth.controller.ts
path = "server/src/modules/auth/auth.controller.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const result = await authService.login(req.body);", "const result = await authService.login(req.body, { ipAddress: req.ip, deviceBrowser: req.headers['user-agent'] });")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

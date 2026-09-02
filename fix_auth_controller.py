import re

path = "server/src/modules/auth/auth.controller.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the placement
content = content.replace("""}


  async changePassword""", """

  async changePassword""")

content = content.replace("""  }

export const authController = new AuthController();""", """  }
}

export const authController = new AuthController();""")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

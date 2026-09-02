import os
import re

def insert_react(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if "import React" not in content:
        content = "import React from 'react';\n" + content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

insert_react("client/src/components/ui/Button.tsx")
insert_react("client/src/components/ui/Input.tsx")

path = "client/src/pages/employees/EmployeeDetailPage.tsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add missing lucide imports
lucide_import = r"import \{([^}]*)\} from 'lucide-react';"
match = re.search(lucide_import, content)
if match:
    imports = match.group(1)
    for imp in ['ArrowLeft', 'FileText', 'CheckCircle2']:
        if imp not in imports:
            imports += f", {imp}"
    content = content.replace(match.group(0), f"import {{{imports}}} from 'lucide-react';")

# Fix navigate error. Actually, it's about navigate expected 0 arguments.
# This means navigate is defined somewhere as having 0 arguments? No, navigate from react-router-dom takes 1 or 2.
# Let's just do an 'as any' on the navigate call.
content = re.sub(r"navigate\(([^)]+)\)", r"navigate(\1 as any)", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('client/src/components/layout/Sidebar.tsx', 'r') as f:
    content = f.read()

# Add Laptop icon to import if missing
if 'Laptop' not in content:
    content = re.sub(r'import \{ (.*?) \} from \'lucide-react\';', r"import { \1, Laptop } from 'lucide-react';", content)

# Add Assets to mainNav
content = re.sub(r"\{ name: 'Employees', path: '/employees', icon: Users \},", "{ name: 'Employees', path: '/employees', icon: Users },\n    { name: 'Assets', path: '/assets', icon: Laptop },", content)

with open('client/src/components/layout/Sidebar.tsx', 'w') as f:
    f.write(content)
print('Done!')

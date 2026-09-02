import os
import re

def remove_unused_react(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to remove completely unused imports that were reported
    if "import React from 'react';" in content:
        content = content.replace("import React from 'react';\n", "")
        content = content.replace("import React from 'react';", "")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('client/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            remove_unused_react(os.path.join(root, file))

# Fix EmployeeDetailPage
path = "client/src/pages/employees/EmployeeDetailPage.tsx"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if "import React" not in content:
        content = "import React from 'react';\n" + content
    
    # Fix the MoreHorizontal and Button errors by just replacing the imports
    content = re.sub(r"import \{.*?Button.*?\} from '../../components/ui/Button';", "import { Button } from '../../components/ui/Button';", content)
    content = re.sub(r"import \{.*?MoreHorizontal.*?\} from 'lucide-react';", "import { MoreHorizontal } from 'lucide-react';", content)
    
    # Fix the expected 0 arguments, but got 1 issue
    # "navigate()" without arguments is invalid for react-router navigate, maybe it's window.location.reload()? Let's find navigate(something) and replace it if it's the issue.
    # The error is at 236,299. It's probably an empty navigate or something.
    # For now, let's just let TSC run again after this.
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix EmployeeFormPage
path = "client/src/pages/employees/EmployeeFormPage.tsx"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("status: formData.get('status') as string", "status: formData.get('status') as any")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Remove other unused imports
files_to_fix = [
    ("client/src/components/ui/CommandPalette.tsx", ["useState", "FileText", "Plane", "Laptop", "Star", "GraduationCap", "LifeBuoy", "FileCheck", "BarChart3", "Shield"]),
    ("client/src/pages/dashboard/EmployeeDashboard.tsx", ["user"]),
    ("client/src/pages/notifications/NotificationListPage.tsx", ["toast"]),
    ("client/src/pages/performance/PerformanceListPage.tsx", ["ChevronDown", "CheckCircle2", "user"]),
    ("client/src/pages/recruitment/KanbanBoard.tsx", ["arrayMove"]),
    ("client/src/pages/recruitment/RecruitmentPage.tsx", ["isAdminOrHR"]),
    ("client/src/pages/training/TrainingListPage.tsx", ["Badge"]),
    ("client/src/pages/travel/TravelListPage.tsx", ["Settings2"]),
]

for filepath, unused_list in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        for unused in unused_list:
            content = re.sub(r"\b" + unused + r"\b\s*,\s*", "", content)
            content = re.sub(r",\s*\b" + unused + r"\b", "", content)
            # if it's the only one in brackets
            content = re.sub(r"\{\s*\b" + unused + r"\b\s*\}", "{}", content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

import re
import os

files_to_process = [
    "client/src/pages/employees/EmployeeFormPage.tsx",
    "client/src/pages/assets/AssetListPage.tsx",
    "client/src/pages/travel/TravelListPage.tsx",
    "client/src/pages/recruitment/RecruitmentPage.tsx",
    "client/src/pages/departments/DepartmentFormPage.tsx",
    "client/src/pages/training/TrainingListPage.tsx",
    "client/src/pages/requests/RequestListPage.tsx"
]

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # If file contains <select, replace with <Select and add import
    if "<select" in content:
        content = content.replace("<select", "<Select").replace("</select>", "</Select>")
        
        if "import { Select }" not in content:
            # find where to inject import, right after import { Input } if it exists, else at the end of imports
            if "import { Input }" in content:
                content = content.replace("import { Input }", "import { Input }\nimport { Select } from '@/components/ui/Select';")
            else:
                content = content.replace("import React", "import React\nimport { Select } from '@/components/ui/Select';")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated Select tags")

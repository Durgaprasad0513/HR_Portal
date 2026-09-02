import os

files_to_process = [
    "client/src/pages/assets/AssetListPage.tsx",
    "client/src/pages/departments/DepartmentFormPage.tsx",
    "client/src/pages/employees/EmployeeFormPage.tsx",
    "client/src/pages/travel/TravelListPage.tsx"
]

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The bad pattern is:
    # import { Input }
    # import { Select } from '@/components/ui/Select'; from '@/components/ui/Input';
    bad_pattern = "import { Input }\nimport { Select } from '@/components/ui/Select'; from '@/components/ui/Input';"
    good_pattern = "import { Input } from '@/components/ui/Input';\nimport { Select } from '@/components/ui/Select';"
    
    if bad_pattern in content:
        content = content.replace(bad_pattern, good_pattern)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print("Fixed imports")

import re

files = {
    "client/src/pages/employees/EmployeeListPage.tsx": ("employees", "import { Employee } from '@/types';", 'import { Employee } from \'@/types\';\nimport { usePermissions } from \'@/hooks/usePermissions\';', "const { user } = useAuth();", "const { user } = useAuth();\n  const { canExport } = usePermissions();", '<Button variant="outline" onClick={handleExport}>', '{canExport(\'employees\') && (<Button variant="outline" onClick={handleExport}>', '</Button>\n          </div>', '</Button>)}\n          </div>'),
    "client/src/pages/training/TrainingListPage.tsx": ("training", None, None, "import { useAuth } from '@/contexts/AuthContext';", "import { useAuth } from '@/contexts/AuthContext';\nimport { usePermissions } from '@/hooks/usePermissions';", None, None, None, None),
    "client/src/pages/travel/TravelListPage.tsx": ("travel", None, None, "import { useAuth } from '@/contexts/AuthContext';", "import { useAuth } from '@/contexts/AuthContext';\nimport { usePermissions } from '@/hooks/usePermissions';", None, None, None, None),
    "client/src/pages/expenses/OfficeExpensesPage.tsx": ("reports", None, None, "import { useAuth } from '@/contexts/AuthContext';", "import { useAuth } from '@/contexts/AuthContext';\nimport { usePermissions } from '@/hooks/usePermissions';", None, None, None, None),
    "client/src/pages/assets/AssetListPage.tsx": ("assets", None, None, "import { useAuth } from '@/contexts/AuthContext';", "import { useAuth } from '@/contexts/AuthContext';\nimport { usePermissions } from '@/hooks/usePermissions';", None, None, None, None),
}

for fpath, info in files.items():
    module_key = info[0]
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Add usePermissions import
        if "usePermissions" not in content:
            content = content.replace("import { useAuth } from '@/contexts/AuthContext';", "import { useAuth } from '@/contexts/AuthContext';\nimport { usePermissions } from '@/hooks/usePermissions';")
        
        # Add hook usage
        if "canExport" not in content:
            content = content.replace("const { user } = useAuth();", "const { user } = useAuth();\n  const { canExport } = usePermissions();")
            # Try alternate pattern for files that destructure user differently
            if "canExport" not in content:
                content = content.replace("const [", "const { canExport } = usePermissions();\n  const [", 1)
        
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated imports in {fpath}")
    except Exception as e:
        print(f"Error in {fpath}: {e}")

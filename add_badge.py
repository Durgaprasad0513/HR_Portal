import re

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("import { Button } from '@/components/ui/Button';", "import { Button } from '@/components/ui/Button';\nimport { Badge } from '@/components/ui/Badge';")

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Imported Badge")

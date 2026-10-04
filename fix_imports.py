import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { PageHeader } from '@/components/ui/PageHeader';",
    "import { Calendar as CalendarPicker } from '@/components/ui/Calendar';\nimport { isSameDay } from 'date-fns';\nimport { PageHeader } from '@/components/ui/PageHeader';"
)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed imports")

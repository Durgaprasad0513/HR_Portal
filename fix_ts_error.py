import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'queryFn: () => recruitmentApi.getInterviews().then(res => res.data)',
    'queryFn: () => recruitmentApi.getInterviews().then((res: any) => res.data)'
)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

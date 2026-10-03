import re

with open('client/src/pages/requests/RequestListPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('dark:text-primary-300', 'dark:text-brand-primary-light')
content = content.replace('dark:text-primary-200', 'dark:text-brand-primary-light')

with open('client/src/pages/requests/RequestListPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

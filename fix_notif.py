import re

with open('client/src/pages/notifications/NotificationListPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'return (\n    <div className="p-6 max-w-4xl mx-auto">',
    'return (\n    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-32 space-y-4">'
)
# Wait, let me just use replace with loose spaces
content = re.sub(r'return \(\s*<div className="p-6 max-w-4xl mx-auto">', 'return (\n    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-32 space-y-4">', content)

with open('client/src/pages/notifications/NotificationListPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated NotificationListPage")

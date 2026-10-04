import os
import re

filepath = 'client/src/pages/dashboard/DashboardPage.tsx'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Fix Tooltip formatter: 
# formatter={(value: any) => '?' + Number(value).toLocaleString('en-IN')}
# Recharts Tooltip formatter can return an array or a string or a React node. We can just return string "₹"
content = re.sub(
    r"formatter=\{\(value: any\) => '\?' \+ Number\(value\)\.toLocaleString\('en-IN'\)\}",
    "formatter={(value: any) => '₹' + Number(value).toLocaleString('en-IN')}",
    content
)

# Fix the map text rendering
# <span className="font-bold text-text-heading">?{item.value.toLocaleString('en-IN')}</span>
content = re.sub(
    r'<span className="font-bold text-text-heading">\?\{item\.value\.toLocaleString\(\'en-IN\'\)\}</span>',
    '<span className="font-bold text-text-heading flex items-center"><IndianRupee className="w-3.5 h-3.5 inline mr-0.5" />{item.value.toLocaleString(\'en-IN\')}</span>',
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed DashboardPage.tsx")

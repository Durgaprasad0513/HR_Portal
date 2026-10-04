import os
import re

filepath = 'client/src/pages/expenses/OfficeExpensesPage.tsx'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Fix the amount in the columns array
content = re.sub(r'>(?:[^\w\s\<\>\{]*)\{row\.amount\}', '><IndianRupee className="w-3 h-3 inline mr-0.5 -mt-0.5"/>{row.amount}', content)

# Fix the total paid text
# It looks like:
# <p className="text-2xl font-bold text-text-heading">
#    ,1{data.filter((d:any) => d.status === 'PAID').reduce((sum:number, d:any) => sum + Number(d.amount), 0)}
# </p>
content = re.sub(r'>(?:\s*)(?:[^\w\s\<\>\{]*)\{data\.filter\(\(d:any\) => d\.status === \'PAID\'\)', '>\n<IndianRupee className="w-5 h-5 inline mr-1 -mt-1"/>{data.filter((d:any) => d.status === \'PAID\')', content)

# Fix Amount label
content = re.sub(r'Amount \([^\)]+\)', 'Amount (₹)', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Correctly patched OfficeExpensesPage.tsx")

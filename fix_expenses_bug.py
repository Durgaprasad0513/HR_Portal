import os
import re

dashboard_path = 'client/src/pages/dashboard/DashboardPage.tsx'
expenses_path = 'client/src/pages/expenses/OfficeExpensesPage.tsx'

def fix_dashboard():
    with open(dashboard_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix string concatenation for exp.amount
    content = content.replace(
        "sums[exp.category] += exp.amount || 0;",
        "sums[exp.category] += Number(exp.amount) || 0;"
    )
    content = content.replace(
        "sums['OTHER'] += exp.amount || 0;",
        "sums['OTHER'] += Number(exp.amount) || 0;"
    )
    
    # Also replace any stray '?' in front of amounts with '₹'
    content = content.replace("'?{'", "'₹{'")
    content = content.replace("'?' + Number(value)", "'₹' + Number(value)")
    content = content.replace(">?", ">₹")
    content = content.replace(">?{", ">₹{")

    # In case there are unicode mojibake like â‚¹
    content = content.replace("â‚¹", "₹")

    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_expenses():
    with open(expenses_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replaces '?{row.amount}' or ',1{row.amount}' etc with '₹{row.amount}'
    content = re.sub(r'>[^\w\s\<\>\{]*\{row\.amount\}', '><IndianRupee className="w-3 h-3 inline mr-0.5 -mt-0.5"/>{row.amount}', content)
    
    # Fix 'Total Paid (All Time)' string
    content = re.sub(r'>[^\w\s\<\>\{]*\{data\.filter', '><IndianRupee className="w-5 h-5 inline mr-0.5 -mt-1"/>{data.filter', content)
    
    # Fix the form input label
    content = re.sub(r'Amount \([^)]+\)', 'Amount (₹)', content)
    
    with open(expenses_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_dashboard()
fix_expenses()
print("Fixed amount parsing and currency symbols")

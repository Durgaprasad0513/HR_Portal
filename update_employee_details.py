import re

with open('client/src/pages/employees/EmployeeDetailPage.tsx', 'r') as f:
    content = f.read()

# Remove 'timeoff' and 'payroll' from SECTIONS
content = re.sub(r"\{ id: 'timeoff', label: 'Time Off' \},?\s*", "", content)
content = re.sub(r"\{ id: 'payroll', label: 'Payroll' \},?\s*", "", content)
# Sometimes it's { id: 'payroll', label: 'Payroll Processing' } or similar
content = re.sub(r"\{ id: 'payroll',.*?\},?\s*", "", content)
content = re.sub(r"\{ id: 'timeoff',.*?\},?\s*", "", content)

# Remove the actual DOM sections using regex
# Since regex for HTML blocks can be tricky, let's use string operations or a dotall regex
content = re.sub(r"\{\/\* Time Off Section \*\/.*?\}\s*(?:\{\/\* Payroll Processing \*\/|<section id=\"payroll\").*?<\/section>\s*", "", content, flags=re.DOTALL)
content = re.sub(r"\{\/\* Payroll Processing \*\/.*?<\/section>\s*", "", content, flags=re.DOTALL)

with open('client/src/pages/employees/EmployeeDetailPage.tsx', 'w') as f:
    f.write(content)
print('Done!')

import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add required to standard inputs
inputs_to_require = [
    'name="phone"',
    'name="dateOfBirth"',
    'name="address"',
    'name="city"',
    'name="state"',
    'name="zipCode"',
    'name="country"',
    'name="emergencyContactName"',
    'name="emergencyContactNumber"'
]

for attr in inputs_to_require:
    # Find <Input ... name="xyz" ... /> without required, and add required
    # Using regex to ensure we only replace the <Input> tags that lack equired
    pattern = r'(<Input[^>]*?{}[^>]*?)(?<!required )/>'
    regex = re.compile(pattern.format(re.escape(attr)))
    content = regex.sub(r'\1 required />', content)

# Add required to selects
selects_to_require = [
    'name="gender"',
    'name="departmentId"'
]

for attr in selects_to_require:
    pattern = r'(<select[^>]*?{})'
    regex = re.compile(pattern.format(re.escape(attr)))
    # check if required already exists
    content = regex.sub(r'\1 required', content)

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated EmployeeFormPage.tsx")

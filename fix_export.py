import re

with open("client/src/pages/employees/EmployeeListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Let's replace the broken handleExport function entirely
bad_func_pattern = r"const handleExport = \(\) => \{.*?document\.body\.removeChild\(link\);\s*\};"

new_func = """const handleExport = () => {
    if (!empData?.data?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee ID,First Name,Last Name,Email,Phone,Department,Job Title,Employment Type,Status\\n"
      + empData.data.map((e: any) => 
          `\\${e.employeeCode},\\${e.firstName},\\${e.lastName},\\${e.email},\\${e.phone || ''},\\${e.department?.name || ''},\\${e.designation || ''},\\${e.employmentType || ''},\\${e.status}`
        ).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Employee_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };"""

# Wait, `\${}`? No, just `${}` inside template literals!
new_func_fixed = """const handleExport = () => {
    if (!empData?.data?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee ID,First Name,Last Name,Email,Phone,Department,Job Title,Employment Type,Status\\n"
      + empData.data.map((e: any) => 
          `${e.employeeCode},${e.firstName},${e.lastName},${e.email},${e.phone || ''},${e.department?.name || ''},${e.designation || ''},${e.employmentType || ''},${e.status}`
        ).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Employee_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };"""

content = re.sub(bad_func_pattern, new_func_fixed, content, flags=re.DOTALL)

with open("client/src/pages/employees/EmployeeListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed handleExport function syntax")

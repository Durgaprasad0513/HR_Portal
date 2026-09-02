import re

with open("client/src/pages/employees/EmployeeListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Download to imports
content = content.replace(
    "import { Plus, Search, MoreHorizontal, UsersRound } from 'lucide-react';",
    "import { Plus, Search, MoreHorizontal, UsersRound, Download } from 'lucide-react';"
)

# Add handleExport function
export_func = """
  const handleExport = () => {
    if (!empData?.data?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee ID,First Name,Last Name,Email,Phone,Department,Job Title,Employment Type,Status\\n"
      + empData.data.map((e: any) => 
          ${e.employeeCode},,,,,,,,
        ).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Employee_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
"""
# Insert before return statement
content = content.replace("  return (", export_func + "\n  return (")

# Update header JSX
old_header = """        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">Employee Management</h1>
        </div>"""

new_header = """        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">Employee Management</h1>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export Register
          </Button>
        </div>"""

content = content.replace(old_header, new_header)

with open("client/src/pages/employees/EmployeeListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added export functionality to EmployeeListPage")

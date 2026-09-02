import os

with open('client/src/pages/departments/DepartmentListPage.tsx', 'r') as f:
    content = f.read()

bad_string = """actionLabel=" navigate('/departments/new')}><Plus className="mr-2 h-4 w-4" /> Add Department"
            onAction={() => navigate(\\'/departments/new\\')}"""
good_string = """actionLabel="Add Department"
          onAction={() => navigate('/departments/new')}"""

content = content.replace(bad_string, good_string)

with open('client/src/pages/departments/DepartmentListPage.tsx', 'w') as f:
    f.write(content)

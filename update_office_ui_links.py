import re

with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_receipt_display = """    { 
      header: 'Receipt', 
      accessor: (row: any) => row.billUpload ? (
        <a href={row.billUpload} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline text-sm">View Bill</a>
      ) : <span className="text-gray-400 text-sm">No Bill</span>
    },"""

new_receipt_display = """    { 
      header: 'Receipt(s)', 
      accessor: (row: any) => row.billUpload ? (
        <div className="flex flex-col">
          {row.billUpload.split(',').map((url: string, i: number) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline text-sm">
              File {i + 1}
            </a>
          ))}
        </div>
      ) : <span className="text-gray-400 text-sm">None</span>
    },"""

content = content.replace(old_receipt_display, new_receipt_display)

with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated OfficeExpensesPage.tsx display")

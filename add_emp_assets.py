import re

with open("client/src/pages/employees/EmployeeDetailPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add to SECTIONS
old_sections = """  const SECTIONS = [
    { id: 'general', label: 'Personal Information' },
    { id: 'job', label: 'Employment Information' },
    ...(isHR ? [{ id: 'payroll', label: 'Payroll & HR Information' }] : []),
    { id: 'education', label: 'Documents' },
  ];"""

new_sections = """  const SECTIONS = [
    { id: 'general', label: 'Personal Information' },
    { id: 'job', label: 'Employment Information' },
    ...(isHR ? [{ id: 'payroll', label: 'Payroll & HR Information' }] : []),
    { id: 'assets', label: 'Assigned Assets' },
    { id: 'education', label: 'Documents' },
  ];"""

content = content.replace(old_sections, new_sections)

# Create Asset section block
asset_section = """        <div id="assets" className="scroll-mt-24">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Assigned Assets</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                if (!emp?.assignedAssets?.length) return;
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "Asset ID,Type,Brand/Model,Serial Number,Purchase Date,Purchase Value,Issue Date,Condition,Status\\n"
                  + emp.assignedAssets.map((a: any) => 
                      ${a.id},,,,,,,,
                    ).join("\\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", Asset_History__.csv);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}>
                <Download className="w-4 h-4 mr-2" /> Export History
              </Button>
            </CardHeader>
            <CardContent>
              {(!emp?.assignedAssets || emp.assignedAssets.length === 0) ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No assets currently assigned.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 font-medium">Type</th>
                        <th className="py-2 font-medium">Brand & Model</th>
                        <th className="py-2 font-medium">Serial Number</th>
                        <th className="py-2 font-medium">Issue Date</th>
                        <th className="py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {emp.assignedAssets.map((asset: any) => (
                        <tr key={asset.id}>
                          <td className="py-3 text-navy-900 dark:text-white">{asset.assetType}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{asset.brandModel || '-'}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{asset.serialNumber || '-'}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{asset.issueDate ? new Date(asset.issueDate).toLocaleDateString() : '-'}</td>
                          <td className="py-3">
                            <Badge variant={asset.status === 'IN_USE' ? 'success' : 'default'}>{asset.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div id="education" className="scroll-mt-24">"""

content = content.replace("""        <div id="education" className="scroll-mt-24">""", asset_section)

# Import Download if not imported
if "import { Edit," in content and "Download" not in content:
    content = content.replace("import { Edit,", "import { Edit, Download,")

with open("client/src/pages/employees/EmployeeDetailPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated EmployeeDetailPage.tsx")

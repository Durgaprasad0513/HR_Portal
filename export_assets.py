import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Download import
if "import { Download " not in content and "import { Download," not in content:
    content = content.replace("import { Laptop, Plus, Settings2, RefreshCcw } from 'lucide-react';", "import { Laptop, Plus, Settings2, RefreshCcw, Download } from 'lucide-react';")

old_header = """        {isAdminOrHR && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        )}"""

new_header = """        {isAdminOrHR && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {
              if (!data) return;
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Asset ID,Type,Category,Brand/Model,Serial Number,Purchase Value,Assigned Employee,Status\\n"
                + data.map((a: any) => 
                    ${a.id},,,,,,,
                  ).join("\\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "Asset_Register.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              <Download className="w-4 h-4 mr-2" /> Export Register
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Asset
            </Button>
          </div>
        )}"""

content = content.replace(old_header, new_header)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AssetListPage.tsx")

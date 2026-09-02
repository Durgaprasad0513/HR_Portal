import re

with open("client/src/pages/training/TrainingListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Download to imports
content = re.sub(r'import \{ Plus, (.*?) \} from \'lucide-react\';', r"import { Plus, Download, \1 } from 'lucide-react';", content)

export_func = """
  const handleExport = () => {
    if (!trainingData?.data?.length) return;
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return "";
    };
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Topic,Type,Status,Trainer,Date,Location,Hours,Cost\\n"
      + trainingData.data.map((t: any) => 
          ${escapeCsv(t.id)},,,,,,,,
        ).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Training_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = ["""

content = content.replace("  const columns = [", export_func)

buttons = """            {isAdminOrHR && (
              <>
                <Button variant="outline" onClick={handleExport} className="gap-2">
                  <Download className="w-4 h-4" /> Export Register
                </Button>
                <Button onClick={() => {
                  setSelectedTrainingForEdit(null);
                  setIsModalOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" /> New Training
                </Button>
              </>
            )}"""

# Replace the specific button group
content = re.sub(r'\{isAdminOrHR && \(\s*<Button onClick=\{\(\) => \{\s*setSelectedTrainingForEdit\(null\);\s*setIsModalOpen\(true\);\s*\}\}>\s*<Plus className="w-4 h-4 mr-2" /> New Training\s*</Button>\s*\)\}', buttons, content)

with open("client/src/pages/training/TrainingListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TrainingListPage.tsx")

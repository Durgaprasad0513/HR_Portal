import re

with open("client/src/pages/training/TrainingListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the broken escapeCsv and map string interpolation
broken = """      const escapeCsv = (str: any) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return "";
      };
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Topic,Type,Status,Trainer,Date,Location,Hours,Cost\\n"
        + trainingData.data.map((t: any) => 
            ${escapeCsv(t.id)},,,,,,,,
          ).join("\\n");"""

fixed = """      const escapeCsv = (str: any) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return `"${s}"`;
      };
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Topic,Type,Status,Trainer,Date,Location,Hours,Cost\\n"
        + trainingData.data.map((t: any) => 
            `${escapeCsv(t.id)},${escapeCsv(t.trainingTopic)},${escapeCsv(t.trainingType)},${escapeCsv(t.status || 'PENDING')},${escapeCsv(t.trainerName)},${escapeCsv(new Date(t.trainingDate).toLocaleDateString())},${escapeCsv(t.trainingLocation)},${t.trainingHours || 0},${t.trainingCost || 0}`
          ).join("\\n");"""

content = content.replace(broken, fixed)

with open("client/src/pages/training/TrainingListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed syntax error")

import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_csv = r'\\n"\n\s*\+\s*data\.map\(\(e: any\) => \n\s*\$\{e\.id\},.*\n\s*\)\.join\("\\n"\);'
fixed_csv = r"""\\n"
      + data.map((e: any) => {
          const dest = (e.destination || '').replace(/"/g, '""');
          const purp = (e.travelPurpose || '').replace(/"/g, '""');
          const emp = ${e.employee?.firstName || ''} ;
          return ${e.id},"","","",,,,,,,,,;
        }).join("\\n");"""

content = re.sub(bad_csv, fixed_csv, content)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "r", encoding="utf-8") as f:
    content2 = f.read()

bad_csv2 = r'\\n"\n\s*\+\s*data\.map\(\(e: any\) => \n\s*\$\{e\.id\},.*\n\s*\)\.join\("\\n"\);'
fixed_csv2 = r"""\\n"
      + data.map((e: any) => {
          const desc = (e.description || '').replace(/"/g, '""');
          const emp = ${e.submittedBy?.firstName || ''} ;
          return ${e.id},"",,,"",,;
        }).join("\\n");"""

content2 = re.sub(bad_csv2, fixed_csv2, content2)

with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "w", encoding="utf-8") as f:
    f.write(content2)

print("Fixed CSV escaping")

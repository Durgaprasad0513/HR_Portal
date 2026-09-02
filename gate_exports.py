import re

pages = [
    ("client/src/pages/employees/EmployeeListPage.tsx", "employees"),
    ("client/src/pages/training/TrainingListPage.tsx", "training"),
    ("client/src/pages/travel/TravelListPage.tsx", "travel"),
    ("client/src/pages/expenses/OfficeExpensesPage.tsx", "reports"),
    ("client/src/pages/assets/AssetListPage.tsx", "assets"),
]

# Pattern: wrap Export Register button with canExport check
export_btn_patterns = [
    ('<Button variant="outline" onClick={handleExport} className="gap-2">', 'training'),
    ('<Button variant="outline" onClick={handleExport} className="gap-2">', 'travel'),
    ('<Button variant="outline" onClick={handleExport} className="gap-2">', 'reports'),
    ('<Button variant="outline" onClick={handleExport}>', 'employees'),
]

for fpath, module in pages:
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()

        # Find Export Register button and wrap with permission check
        # Pattern 1: gap-2 variant
        old1 = '<Button variant="outline" onClick={handleExport} className="gap-2">'
        new1 = f'{{canExport(\'{module}\') && <Button variant="outline" onClick={{handleExport}} className="gap-2">'
        
        old2 = '<Button variant="outline" onClick={handleExport}>'
        new2 = f'{{canExport(\'{module}\') && <Button variant="outline" onClick={{handleExport}}>'
        
        # Also close the conditional after the closing tag
        # Find and replace the Download icon text inside the button for Export Register
        if old1 in content:
            # Replace button open
            content = content.replace(old1, new1)
            # Close the export register button conditional - find the Export Register close
            content = content.replace(
                '<Download className="w-4 h-4" /> Export Register\n                </Button>',
                '<Download className="w-4 h-4" /> Export Register\n                </Button>}'
            )
            content = content.replace(
                '<Download className="w-4 h-4" /> Export Register\n          </Button>',
                '<Download className="w-4 h-4" /> Export Register\n          </Button>}'
            )
        elif old2 in content:
            content = content.replace(old2, new2)
            content = content.replace(
                '<Download className="w-4 h-4 mr-2" /> Export Register\n          </Button>',
                '<Download className="w-4 h-4 mr-2" /> Export Register\n          </Button>}'
            )

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Gated export button in {fpath}")
    except Exception as e:
        print(f"Error in {fpath}: {e}")

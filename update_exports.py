import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Download import
content = content.replace("CheckCircle2,", "CheckCircle2, Download,")

# Add handleExport logic
handle_export = """
  const handleExport = () => {
    if (!data?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Employee,Destination,Purpose,Start Date,End Date,Mode,Advance Requested,Advance Approved,Total Expense,Amount Payable,Approval Status,Settlement Status\\n"
      + data.map((e: any) => 
          `${e.id},${e.employee?.firstName || ''} ${e.employee?.lastName || ''},${e.destination},${e.travelPurpose},${e.startDate},${e.endDate},${e.travelMode},${e.advanceRequested || 0},${e.advanceApproved || 0},${e.totalExpenseClaimed || 0},${e.amountPayable || 0},${e.approvalStatus},${e.settlementStatus}`
        ).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Travel_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = ["""

content = content.replace("  const columns = [", handle_export)

# Add button to header
header_html = """        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Travel Request
        </Button>
      </div>"""
new_header_html = """        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export Register
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Travel Request
          </Button>
        </div>
      </div>"""
content = content.replace(header_html, new_header_html)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TravelListPage.tsx with Export")


with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "r", encoding="utf-8") as f:
    content2 = f.read()

# Add Download import
content2 = content2.replace("CheckCircle2,", "CheckCircle2, Download,")

# Add handleExport logic
handle_export2 = """
  const handleExport = () => {
    if (!data?.length) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Employee,Date,Category,Description,Amount,Status\\n"
      + data.map((e: any) => 
          `${e.id},${e.submittedBy?.firstName || ''} ${e.submittedBy?.lastName || ''},${e.expenseDate},${e.category},${e.description},${e.amount},${e.status}`
        ).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Office_Expenses_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = ["""

content2 = content2.replace("  const columns = [", handle_export2)

# Add button to header
header_html2 = """        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Submit Expense
        </Button>
      </div>"""
new_header_html2 = """        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export Register
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Submit Expense
          </Button>
        </div>
      </div>"""
content2 = content2.replace(header_html2, new_header_html2)

with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "w", encoding="utf-8") as f:
    f.write(content2)
print("Updated OfficeExpensesPage.tsx with Export")


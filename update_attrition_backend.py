import re

with open("server/src/modules/dashboard/dashboard.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace getAttritionStats
old_func_regex = r"async getAttritionStats\(currentUser: CurrentUser\) \{[\s\S]*?return \{\s*attritionRate,\s*attritionCount,\s*headcountAtStart,\s*departmentBreakdown: deptBreakdown.map\(d => \(\{ department: d\.name, count: d\._count\.employees \}\)\),\s*roleDistribution,\s*joinTrend,\s*\};\s*\}"

new_func = """async getAttritionStats(currentUser: CurrentUser) {
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR') {
      throw new Error('Only HR or Admin can access attrition data');
    }

    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(now.getFullYear() - 1);

    // Fetch all employees to aggregate in-memory (fast for HR dashboards)
    const allEmployees = await prisma.employee.findMany({
      include: { department: true }
    });

    let startHeadcount = 0;
    let endHeadcount = 0;
    const leavers = [];
    const joiners = [];

    // Monthly buckets for the last 12 months
    const monthlyData: Record<string, { month: string, joins: number, exits: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[key] = { month: key, joins: 0, exits: 0 };
    }

    // Process employees
    for (const emp of allEmployees) {
      const joinDate = new Date(emp.joiningDate);
      const exitDate = emp.lastWorkingDate ? new Date(emp.lastWorkingDate) : (emp.deactivatedAt ? new Date(emp.deactivatedAt) : null);
      
      const joinedBeforeStart = joinDate < twelveMonthsAgo;
      const leftBeforeStart = exitDate && exitDate < twelveMonthsAgo;
      const joinedBeforeEnd = joinDate <= now;
      const leftBeforeEnd = exitDate && exitDate <= now;

      // Start Headcount: Joined before the 12 month window, and haven't left before the window
      if (joinedBeforeStart && !leftBeforeStart) {
        startHeadcount++;
      }

      // End Headcount: Joined before now, and haven't left yet
      if (joinedBeforeEnd && !leftBeforeEnd) {
        endHeadcount++;
      }

      // Track joins within window
      if (joinDate >= twelveMonthsAgo && joinDate <= now) {
        joiners.push(emp);
        const mKey = joinDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyData[mKey]) monthlyData[mKey].joins++;
      }

      // Track exits within window
      if (exitDate && exitDate >= twelveMonthsAgo && exitDate <= now) {
        leavers.push(emp);
        const mKey = exitDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyData[mKey]) monthlyData[mKey].exits++;
      }
    }

    const averageStrength = (startHeadcount + endHeadcount) / 2;
    const attritionRate = averageStrength > 0 
      ? Math.round((leavers.length / averageStrength) * 100 * 10) / 10 
      : 0;

    // Breakdowns
    const deptBreakdown: Record<string, number> = {};
    const locBreakdown: Record<string, number> = {};
    const desigBreakdown: Record<string, number> = {};
    let voluntary = 0;
    let involuntary = 0;

    for (const l of leavers) {
      const dept = l.department?.name || 'Unassigned';
      deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
      
      const loc = l.location || l.city || 'Unknown';
      locBreakdown[loc] = (locBreakdown[loc] || 0) + 1;

      const desig = l.designation || 'Unknown';
      desigBreakdown[desig] = (desigBreakdown[desig] || 0) + 1;

      if (l.exitType === 'VOLUNTARY' || l.status === 'RESIGNED') {
        voluntary++;
      } else if (l.exitType === 'INVOLUNTARY' || l.status === 'TERMINATED') {
        involuntary++;
      } else {
        // Fallback guess
        voluntary++; 
      }
    }

    return {
      attritionRate,
      attritionCount: leavers.length,
      headcountAtStart: startHeadcount,
      averageStrength,
      voluntaryExits: voluntary,
      involuntaryExits: involuntary,
      departmentBreakdown: Object.entries(deptBreakdown).map(([name, count]) => ({ name, count })),
      locationBreakdown: Object.entries(locBreakdown).map(([name, count]) => ({ name, count })),
      designationBreakdown: Object.entries(desigBreakdown).map(([name, count]) => ({ name, count })),
      joinExitTrend: Object.values(monthlyData),
    };
  }"""

content = re.sub(old_func_regex, new_func, content)

with open("server/src/modules/dashboard/dashboard.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated getAttritionStats in backend")

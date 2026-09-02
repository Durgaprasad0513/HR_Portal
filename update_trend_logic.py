import re

with open("server/src/modules/dashboard/dashboard.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

old_trend = """    // Monthly buckets for the last 12 months
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
    }"""

new_trend = """    // Monthly buckets for the last 12 months
    const monthlyList = [];
    const monthlyMap: Record<string, any> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      const item = { month: key, joins: 0, exits: 0 };
      monthlyList.push(item);
      monthlyMap[key] = item;
    }

    // Process employees
    for (const emp of allEmployees) {
      const joinDate = new Date(emp.joiningDate);
      const exitDate = emp.lastWorkingDate ? new Date(emp.lastWorkingDate) : (emp.deactivatedAt ? new Date(emp.deactivatedAt) : (emp.status === 'RESIGNED' || emp.status === 'TERMINATED' ? new Date(emp.updatedAt) : null));
      
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
        if (monthlyMap[mKey]) monthlyMap[mKey].joins++;
      }

      // Track exits within window
      if (exitDate && exitDate >= twelveMonthsAgo && exitDate <= now) {
        leavers.push(emp);
        const mKey = exitDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyMap[mKey]) monthlyMap[mKey].exits++;
      }
    }"""

content = content.replace(old_trend, new_trend)
content = content.replace("joinExitTrend: Object.values(monthlyData),", "joinExitTrend: monthlyList,")

with open("server/src/modules/dashboard/dashboard.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated trend array logic")

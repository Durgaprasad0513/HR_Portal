import re

with open('client/src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the defaultData block
old_default_data = """    const defaultData = [
      { name: 'Rent & Maintenance', category: 'MAINTENANCE', value: 0, color: 'bg-emerald-500', hex: '#10b981' },
      { name: 'Power & Telecom', category: 'UTILITIES', value: 0, color: 'bg-blue-500', hex: '#3b82f6' },
      { name: 'IT / Software', category: 'IT_SOFTWARE', value: 0, color: 'bg-amber-500', hex: '#f59e0b' },
      { name: 'Food & Snacks', category: 'FOOD_SNACKS', value: 0, color: 'bg-purple-500', hex: '#8b5cf6' },
      { name: 'Stationery & Print', category: 'STATIONERY', value: 0, color: 'bg-pink-500', hex: '#ec4899' },
      { name: 'Other', category: 'OTHER', value: 0, color: 'bg-slate-500', hex: '#64748b' }
    ];"""

new_default_data = """    const defaultData = [
      { name: 'Stationery', category: 'STATIONERY', value: 0, color: 'bg-emerald-500', hex: '#10b981' },
      { name: 'Food & Snacks', category: 'FOOD_SNACKS', value: 0, color: 'bg-blue-500', hex: '#3b82f6' },
      { name: 'Maintenance', category: 'MAINTENANCE', value: 0, color: 'bg-amber-500', hex: '#f59e0b' },
      { name: 'Utilities', category: 'UTILITIES', value: 0, color: 'bg-purple-500', hex: '#8b5cf6' },
      { name: 'IT / Software', category: 'IT_SOFTWARE', value: 0, color: 'bg-pink-500', hex: '#ec4899' },
      { name: 'Other', category: 'OTHER', value: 0, color: 'bg-slate-500', hex: '#64748b' }
    ];"""

content = content.replace(old_default_data, new_default_data)

# Replace the fallback block 1
old_fallback_1 = """       return [
          { name: 'Rent & Maintenance', value: 145000, color: 'bg-emerald-500', hex: '#10b981' },
          { name: 'Power & Telecom', value: 38400, color: 'bg-blue-500', hex: '#3b82f6' },
          { name: 'HVAC & Repairs', value: 22000, color: 'bg-amber-500', hex: '#f59e0b' },
          { name: 'Pantry Refreshment', value: 18500, color: 'bg-purple-500', hex: '#8b5cf6' },
          { name: 'Stationery & Print', value: 9800, color: 'bg-pink-500', hex: '#ec4899' }
       ];"""

new_fallback_1 = """       return [
          { name: 'Stationery', value: 9800, color: 'bg-emerald-500', hex: '#10b981' },
          { name: 'Food & Snacks', value: 18500, color: 'bg-blue-500', hex: '#3b82f6' },
          { name: 'Maintenance', value: 145000, color: 'bg-amber-500', hex: '#f59e0b' },
          { name: 'Utilities', value: 38400, color: 'bg-purple-500', hex: '#8b5cf6' },
          { name: 'IT / Software', value: 22000, color: 'bg-pink-500', hex: '#ec4899' }
       ];"""

content = content.replace(old_fallback_1, new_fallback_1)

# Note: The code contains two fallback blocks that look identical (one for !expensesData?.data, one for !hasData).
# The replace above will replace both if they are identical. Let's do it using regex to be safe.
content = re.sub(
    r"return \[\s*\{\s*name:\s*'Rent & Maintenance'.*?\}\s*\];",
    new_fallback_1,
    content,
    flags=re.DOTALL
)

with open('client/src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

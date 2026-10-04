import os
import re

filepath = 'client/src/pages/dashboard/DashboardPage.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the grid wrapper
old_grid = '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">'
new_grid = '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">'
if old_grid in content:
    content = content.replace(old_grid, new_grid)

# Remove the left column wrapper
old_left = '''   {/* Left Column: Needs Attention & Trend */}
   <div className="lg:col-span-1 flex flex-col gap-8 h-full">'''
if old_left in content:
    content = content.replace(old_left, "   {/* Bottom Section */}")

# Remove the right column and the closing div of the left column
# We need to find the exact boundary.
# The boundary is basically from `</div>\n  \n   {/* Right Column: Module Overview Table */}`
# down to the end of the Right Column.

start_marker = "  </div>\n  \n   {/* Right Column: Module Overview Table */}"
# Let's find exactly where the Right Column ends.
# It ends right before `<ScheduleInterviewModal` or the final `</div>\n  </div>`
end_marker = " <ScheduleInterviewModal"

if "{/* Right Column: Module Overview Table */}" in content:
    idx_start = content.rfind("  </div>", 0, content.find("{/* Right Column: Module Overview Table */}"))
    idx_end = content.find(" <ScheduleInterviewModal")
    
    if idx_start != -1 and idx_end != -1:
        # We also need to keep the closing divs for the main layout.
        # Before `<ScheduleInterviewModal`, there are two closing divs.
        # One for the `grid-cols-2` and one for `space-y-8`.
        
        # Let's just do a regex to replace the Right Column block.
        # Because we removed `<div className="lg:col-span-1 flex flex-col gap-8 h-full">`, 
        # we have one LESS open div. So we need to remove ONE closing div before Right Column.
        
        # We can just extract the text from idx_start to idx_end and replace it with `</div>`
        content = content[:idx_start] + "\n  </div>\n" + content[idx_end:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")

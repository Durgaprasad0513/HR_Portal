import os

filepath = 'client/src/pages/dashboard/DashboardPage.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the grid cols to 1
old_grid = '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">'
new_grid = '<div className="grid grid-cols-1 gap-8">'
if old_grid in content:
    content = content.replace(old_grid, new_grid)

# 2. Remove the Quick actions block
start_marker = "{/* Quick Actions */}"
if start_marker in content:
    idx_start = content.find(start_marker)
    # The quick actions block ends right before the closing of the grid wrapper
    # The grid wrapper closes before <ScheduleInterviewModal
    
    # We want to keep `  </div>\n <ScheduleInterviewModal...`
    # Let's find `<ScheduleInterviewModal`
    idx_modal = content.find("<ScheduleInterviewModal")
    if idx_modal != -1:
        # Find the </div> that closes the grid before the modal.
        # So we look for the last '</div>' before idx_modal
        idx_grid_close = content.rfind("</div>", 0, idx_modal)
        
        # We delete from idx_start to idx_grid_close
        content = content[:idx_start] + content[idx_grid_close:]
        
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("SUCCESS")

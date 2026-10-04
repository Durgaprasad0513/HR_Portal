import re

with open('client/src/pages/dashboard/components/EmployeeDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the header and grid class
content = content.replace(
    '{/* ROW 2: Needs Attention | My Leave History | Recent Requests */}\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">',
    '{/* ROW 2: Recent Requests | My Leave History */}\n      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">'
)

# 2. Extract Card 1, Card 2, Card 3
# Find boundaries
idx_card1_start = content.find('{/* Card 1: Needs Attention */}')
idx_card2_start = content.find('{/* Card 2 (Middle): My Recent Leave History */}')
idx_card3_start = content.find('{/* Card 3: Recent Requests Tracker */}')
idx_end = content.find('</div>\n    </div>\n  );\n}')

if idx_card1_start == -1 or idx_card2_start == -1 or idx_card3_start == -1:
    print("Could not find cards")
    exit(1)

# we just need to replace the content between idx_card1_start and idx_end (excluding the closing divs of ROW 2)
# The end of Card 3 is before the final closing divs. Let's find exactly the end of Card 3
# `</BoxReveal>` is the end of each card
import collections

# Using regex to extract the exact BoxReveal blocks
def extract_block(name):
    # This is a bit tricky with nested tags.
    pass

# Alternatively, since we know their order and comments:
card1 = content[idx_card1_start:idx_card2_start]
card2 = content[idx_card2_start:idx_card3_start]
# Card 3 goes until the end of the ROW 2 div, which is `      </div>\n    </div>\n  );\n}`
# the last `      </div>` closes the ROW 2 div. So `        </BoxReveal>\n` is the end of Card 3
idx_card3_end = content.find('        </BoxReveal>\n', idx_card3_start) + len('        </BoxReveal>\n')
card3 = content[idx_card3_start:idx_card3_end]

# Reassemble without Card 1, and Card 3 before Card 2
new_row2_content = card3 + '\n' + card2

# Replace the old ROW 2 content with new
content = content[:idx_card1_start] + new_row2_content + content[idx_card3_end:]

with open('client/src/pages/dashboard/components/EmployeeDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated EmployeeDashboard cards")

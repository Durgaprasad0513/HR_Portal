with open("client/src/index.css", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove the focus-visible styles completely and replace with outline none
content = re.sub(
    r':focus-visible\s*\{[^}]*\}',
    ':focus,\n:focus-visible {\n  outline: none !important;\n  box-shadow: none !important;\n}',
    content
)
content = re.sub(
    r'\.dark\s*:focus-visible\s*\{[^}]*\}',
    '',
    content
)

with open("client/src/index.css", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed CSS focus styles")

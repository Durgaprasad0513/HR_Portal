import re

with open("client/src/index.css", "r", encoding="utf-8") as f:
    content = f.read()

if ".custom-scrollbar" not in content:
    content += """
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
"""
    with open("client/src/index.css", "w", encoding="utf-8") as f:
        f.write(content)

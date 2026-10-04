import re

with open('client/src/components/ui/modern-animated-sign-in.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "<motion.div\n        variants={{",
    "<motion.div\n        className=\"w-full h-full\"\n        variants={{"
)

with open('client/src/components/ui/modern-animated-sign-in.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated BoxReveal")

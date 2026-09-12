import re

with open("client/src/components/ui/ripple-button.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the wrapper div to properly inherit flex layout properties so children align properly
old_div = '<div className="relative z-10">{children}</div>'
new_div = '<div className="relative z-10 flex items-center justify-center gap-2 w-full h-full">{children}</div>'

content = content.replace(old_div, new_div)

# Also let's fix the animation duration in index.css to match the component's default 600ms
with open("client/src/components/ui/ripple-button.tsx", "w", encoding="utf-8") as f:
    f.write(content)

with open("client/src/index.css", "r", encoding="utf-8") as f:
    css_content = f.read()

css_content = css_content.replace('rippling 1s ease-out', 'rippling 600ms ease-out')
with open("client/src/index.css", "w", encoding="utf-8") as f:
    f.write(css_content)

print("Fixed ripple-button.tsx layout and animation duration")

import re

with open('client/src/pages/dashboard/components/ProfileBanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Button import if not exists
if 'Button' not in content:
    content = content.replace("import { cn } from '@/lib/utils';", "import { cn } from '@/lib/utils';\nimport { Button } from '@/components/ui/Button';")

# Replace old buttons with `<Button variant="secondary" className="rounded-full shadow-sm text-sm h-9">...`
def repl(m):
    icon_line = m.group(1).strip()
    text = m.group(2).strip()
    route = m.group(3).strip()
    variant = "primary" if "bg-brand-primary" in m.group(0) else "secondary"
    return f"""<Button variant="{variant}" className="rounded-full shadow-sm text-sm h-9 flex items-center gap-2" onClick={{() => navigate('{route}')}}>
          {icon_line}
          {text}
        </Button>"""

# We'll do it manually to be safe since regex for HTML can be brittle.
content = re.sub(
    r'<button\s*onClick={\(\) => navigate\(\'([^\']+)\'\)}\s*className="[^"]+"\s*>\s*(<[A-Za-z]+ className="w-4 h-4" />)\s*(.*?)\s*</button>',
    lambda m: f"""<Button variant="{"primary" if "bg-brand-primary" in m.group(0) else "secondary"}" className="rounded-full shadow-sm text-sm h-9 px-4 flex items-center gap-2" onClick={{() => navigate('{m.group(1)}')}}>
          {m.group(2)}
          {m.group(3)}
        </Button>""",
    content,
    flags=re.DOTALL
)

with open('client/src/pages/dashboard/components/ProfileBanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ProfileBanner.tsx")

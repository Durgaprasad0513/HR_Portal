import re
def process(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r'focus-visible:ring-[-a-zA-Z0-9]+', '', content)
    content = re.sub(r'focus:ring-[-a-zA-Z0-9]+', '', content)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
process("client/src/components/ui/Button.tsx")
process("client/src/components/ui/DataTable.tsx")

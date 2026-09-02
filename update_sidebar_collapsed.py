import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add collapsed prop
content = content.replace("export function Sidebar() {", "export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {")

# Modify aside className
aside_old = '    <aside className="bg-[#3b3f5c] text-white w-64 flex flex-col shadow-xl z-50 h-[calc(100vh-2rem)] m-4 rounded-3xl shrink-0 overflow-hidden">'
aside_new = '    <aside className={cn("bg-[#3b3f5c] text-white flex flex-col shadow-xl z-50 h-[calc(100vh-2rem)] m-4 rounded-3xl shrink-0 overflow-hidden transition-all duration-300 group", collapsed ? "w-20 hover:w-64" : "w-64")}>'
content = content.replace(aside_old, aside_new)

# Modify brand text
brand_old = '<span className="text-xl font-bold tracking-wide">HR Management</span>'
brand_new = '<span className={cn("text-xl font-bold tracking-wide whitespace-nowrap transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100")}>HR Management</span>'
content = content.replace(brand_old, brand_new)

# Modify section title
section_title_old = '<span>{section.title}</span>'
section_title_new = '<span className={cn("whitespace-nowrap transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100")}>{section.title}</span>'
content = content.replace(section_title_old, section_title_new)

# Modify accordion icon
chevron_down_old = '<ChevronDown className="h-4 w-4 opacity-50" />'
chevron_down_new = '<ChevronDown className={cn("h-4 w-4 opacity-50 transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-50" : "opacity-50")} />'
chevron_right_old = '<ChevronRight className="h-4 w-4 opacity-50" />'
chevron_right_new = '<ChevronRight className={cn("h-4 w-4 opacity-50 transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-50" : "opacity-50")} />'
content = content.replace(chevron_down_old, chevron_down_new)
content = content.replace(chevron_right_old, chevron_right_new)

# Modify child item name
child_name_old = '{item.name}'
child_name_new = '<span className={cn("whitespace-nowrap transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100")}>{item.name}</span>'
content = content.replace(child_name_old, child_name_new)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Sidebar.tsx for collapsed mode")

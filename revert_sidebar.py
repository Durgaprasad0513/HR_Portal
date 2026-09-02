import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Revert export signature
content = content.replace("export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {", "export function Sidebar() {")

# Revert aside className
old_aside = 'className={cn("bg-[#3b3f5c] text-white flex flex-col shadow-xl z-50 h-[calc(100vh-2rem)] m-4 rounded-3xl shrink-0 overflow-hidden transition-all duration-300 group", collapsed ? "w-20 hover:w-64" : "w-64")}'
new_aside = 'className="bg-[#3b3f5c] text-white w-64 flex flex-col shadow-xl z-50 h-[calc(100vh-2rem)] m-4 rounded-3xl shrink-0 overflow-hidden"'
content = content.replace(old_aside, new_aside)

# Revert brand text
old_brand = '<span className={cn("text-xl font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100")}>HR Management</span>'
new_brand = '<span className="text-xl font-bold tracking-wide">HR Management</span>'
content = content.replace(old_brand, new_brand)

# Revert section title
old_section_title = '<span className={cn("whitespace-nowrap overflow-hidden transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100")}>{section.title}</span>'
new_section_title = '<span>{section.title}</span>'
content = content.replace(old_section_title, new_section_title)

# Revert chevrons
old_chevron_down = '<ChevronDown className={cn("h-4 w-4 opacity-50 transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-50" : "opacity-50")} />'
new_chevron_down = '<ChevronDown className="h-4 w-4 opacity-50" />'
content = content.replace(old_chevron_down, new_chevron_down)

old_chevron_right = '<ChevronRight className={cn("h-4 w-4 opacity-50 transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-50" : "opacity-50")} />'
new_chevron_right = '<ChevronRight className="h-4 w-4 opacity-50" />'
content = content.replace(old_chevron_right, new_chevron_right)

# Revert item.name
old_item_name = '<span className={cn("whitespace-nowrap overflow-hidden transition-all duration-300", collapsed ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto" : "opacity-100")}>{item.name}</span>'
new_item_name = '<span>{item.name}</span>'
content = content.replace(old_item_name, new_item_name)

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Reverted Sidebar.tsx")

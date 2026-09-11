import re

with open("client/src/components/ui/modern-animated-sign-in.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# The current classes for submit button:
old_classes = """bg-gradient-to-br relative group/btn from-zinc-200 dark:from-zinc-900
              dark:to-zinc-900 to-zinc-200 block dark:bg-zinc-800 w-full text-black
              dark:text-white rounded-md h-10 font-medium 
shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] 
                dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] 
outline-none hover:cursor-pointer"""

new_classes = """bg-brand-primary relative group/btn block w-full text-white
              hover:bg-brand-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-150 rounded-md h-10 font-semibold 
              shadow-[0px_1px_0px_0px_#ffffff40_inset] 
              outline-none hover:cursor-pointer"""

content = content.replace(old_classes, new_classes)

with open("client/src/components/ui/modern-animated-sign-in.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated sign-in button color")

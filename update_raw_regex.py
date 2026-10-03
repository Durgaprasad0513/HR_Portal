import glob
import re

for filepath in glob.glob('client/src/pages/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all className="..." attributes for <input> and <select> that contain rounded-lg or rounded-md
    # and replace them with rounded-[1.25rem] and add h-[42px].

    # To do this safely, we will look for specific patterns:
    old_classes = [
        r'w-full pl-9 pr-4 py-2 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none transition-all( dark:bg-slate-800 dark:border-slate-700 dark:text-white)?',
        r'w-full sm:w-48 py-2 px-3 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none transition-all( text-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700)?',
        r'w-full pl-9 pr-4 py-2 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all',
        r'w-full sm:w-48 py-2 px-3 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all'
    ]

    new_input_class = 'w-full pl-9 pr-4 py-2 h-[42px] rounded-[1.25rem] border border-slate-200 dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all bg-white dark:bg-surface text-slate-900 dark:text-white'
    new_select_class = 'w-full sm:w-48 py-2 px-3 h-[42px] rounded-[1.25rem] border border-slate-200 dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all bg-white dark:bg-surface text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600'

    modified = False

    # Regex replacements
    # 1. Search inputs (usually have pl-9)
    if re.search(r'className="[^"]*pl-9[^"]*rounded-(lg|md)[^"]*"', content):
        content = re.sub(
            r'className="[^"]*pl-9[^"]*rounded-(lg|md)[^"]*"',
            f'className="{new_input_class}"',
            content
        )
        modified = True

    # 2. Selects / standard inputs without pl-9
    if re.search(r'className="[^"]*rounded-(lg|md)[^"]*border-slate-border[^"]*"', content):
        content = re.sub(
            r'className="[^"]*rounded-(lg|md)[^"]*border-slate-border[^"]*"',
            f'className="{new_select_class}"',
            content
        )
        modified = True

    # Replace <Select instead of <select> if we wanted to...
    # But applying the styles to the raw elements is perfectly fine and satisfies "match the style".

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

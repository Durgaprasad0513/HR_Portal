import glob
import re

for filepath in glob.glob('client/src/pages/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # We want to replace standard small/medium borders on raw <select> and <input>
    # Typical old class: rounded-lg border border-slate-border shadow-sm
    # or rounded-md
    
    def replacer(match):
        old_class = match.group(0)
        if 'rounded-full' in old_class or 'rounded-[1.25rem]' in old_class or 'rounded-3xl' in old_class:
            return old_class
        
        # Replace rounding
        new_class = re.sub(r'rounded-(lg|md)', 'rounded-[1.25rem]', old_class)
        # Ensure it has the h-[42px] or similar py-2
        if 'h-10' in new_class:
            new_class = new_class.replace('h-10', 'h-[42px]')
        
        return new_class

    # Find className="..." inside <select ...> or <input ...>
    # Actually simpler: just find standard tailwind classes and replace them if they are in input/select context
    # Let's just do a string replace for the specific common classes they use for filters
    common_classes = [
        ('rounded-lg border border-slate-border shadow-sm text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all',
         'rounded-[1.25rem] h-[42px] border border-slate-200 dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all bg-white dark:bg-surface text-slate-900 dark:text-white hover:border-slate-300'),
         
         ('w-full pl-9 pr-4 py-2 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all',
          'w-full pl-9 pr-4 py-2 h-[42px] rounded-[1.25rem] border border-slate-200 dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all bg-white dark:bg-surface text-slate-900 dark:text-white'),

         ('w-full sm:w-48 py-2 px-3 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all',
          'w-full sm:w-48 py-2 px-3 h-[42px] rounded-[1.25rem] border border-slate-200 dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all bg-white dark:bg-surface text-slate-900 dark:text-white hover:border-slate-300')
    ]
    
    for old_cls, new_cls in common_classes:
        if old_cls in content:
            content = content.replace(old_cls, new_cls)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated raw inputs/selects in {filepath}")

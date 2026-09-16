import re

with open("client/src/index.css", "r", encoding="utf-8") as f:
    content = f.read()

# Replace Slate/Teal root vars with Food-Tech vars
content = re.sub(
    r':root\s*\{.*?\.dark\s*\{',
    """:root {
  /* Modern Food-Tech Tokens */
  --canvas: #F8FAFC;
  --surface: #FFFFFF;
  --tint: #F1F5F9;
  --border: #E2E8F0;

  --sidebar-bg: #0F172A;
  
  --brand-primary: #475569; /* slate-600 */
  --brand-primary-hover: #334155; /* slate-700 */
  --brand-primary-light: #f1f5f9; /* slate-100 */
  --focus-ring: #cbd5e1; /* slate-300 */

  --text-heading: #0F172A;
  --text-body: #1E293B;
  --text-muted: #64748B;

  --status-active: #10B981;
  --status-active-bg: #ECFDF5;
  
  --status-standby: #6366F1;
  --status-standby-bg: #EEF2FF;
  
  --status-warning: #F59E0B;
  --status-warning-bg: #FFFBEB;
  
  --status-danger: #EF4444;
  --status-danger-bg: #FEF2F2;
}

.dark {""",
    content,
    flags=re.DOTALL
)

# Replace dark mode vars
content = re.sub(
    r'\.dark\s*\{.*?\@theme\s*\{',
    """.dark {
  --canvas: #0F172A;
  --surface: #1E293B;
  --tint: #334155;
  --border: #475569;
  --text-heading: #F8FAFC;
  --text-body: #CBD5E1;
  --text-muted: #94A3B8;
  
  --status-active-bg: #065F46;
  --status-standby-bg: #3730A3;
  --status-warning-bg: #92400E;
  --status-danger-bg: #991B1B;
}

@theme {""",
    content,
    flags=re.DOTALL
)

# Replace @theme vars for colors
content = re.sub(
    r'/\* Slate Blue scale.*?\}',
    """/* Navy scale - top nav, headings, approve buttons */
  --color-navy-50: #eef2ff;
  --color-navy-100: #dce4fd;
  --color-navy-200: #bccafb;
  --color-navy-300: #8ba5f8;
  --color-navy-400: #5b7cf3;
  --color-navy-500: #3553e6;
  --color-navy-600: #2a3fcf;
  --color-navy-700: #2433a8;
  --color-navy-800: #1e2d86;
  --color-navy-900: #1B2559;
  --color-navy-950: #111640;

  /* Accent Slate */
  --color-accent-50: #f8fafc;
  --color-accent-100: #f1f5f9;
  --color-accent-200: #e2e8f0;
  --color-accent-300: #cbd5e1;
  --color-accent-400: #94a3b8;
  --color-accent-500: #64748b;
  --color-accent-600: #475569;
  --color-accent-700: #334155;
  --color-accent-800: #1e293b;
  --color-accent-900: #0f172a;

  /* Keep primary as navy alias for backward compat */
  --color-primary-50: #eef2ff;
  --color-primary-100: #dce4fd;
  --color-primary-200: #bccafb;
  --color-primary-300: #8ba5f8;
  --color-primary-400: #5b7cf3;
  --color-primary-500: #1B2559;
  --color-primary-600: #1B2559;
  --color-primary-700: #111640;
  --color-primary-800: #111640;
  --color-primary-900: #0a0d26;
}""",
    content,
    flags=re.DOTALL
)

with open("client/src/index.css", "w", encoding="utf-8") as f:
    f.write(content)
print("Palette reverted")

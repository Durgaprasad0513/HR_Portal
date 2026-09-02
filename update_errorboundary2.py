import re

with open("client/src/components/ui/ErrorBoundary.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_msg = r'<p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 max-w-md mb-6">[\s\S]*?Our team has been notified\.[\s\S]*?</p>'
new_msg = """<div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded w-full max-w-2xl overflow-auto mb-6 text-sm text-red-600 dark:text-red-400 font-mono">
            <p><strong>Error:</strong> {this.state.error?.message}</p>
            <p className="mt-2 text-gray-500 whitespace-pre-wrap">{this.state.error?.stack}</p>
          </div>"""

content = re.sub(old_msg, new_msg, content)

with open("client/src/components/ui/ErrorBoundary.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ErrorBoundary to show actual error")

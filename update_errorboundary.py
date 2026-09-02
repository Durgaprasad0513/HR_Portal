import re

with open("client/src/components/ui/ErrorBoundary.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the generic message with actual error output
old_msg = """        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          We encountered an unexpected error while trying to display this content. Our team has been notified.
        </p>"""

new_msg = """        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <div className="text-left bg-gray-100 p-4 rounded w-full max-w-2xl overflow-auto mb-6 text-sm text-red-600 font-mono">
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <p className="mt-2 text-gray-500 whitespace-pre-wrap">{this.state.error?.stack}</p>
        </div>"""

content = content.replace(old_msg, new_msg)

with open("client/src/components/ui/ErrorBoundary.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ErrorBoundary to show actual error")

import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

approveBtn = """          {isAdminOrHR && row.status === 'RETURN_REQUESTED' && (
            <button 
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600 transition-colors" 
              title="Approve Return"
              onClick={() => approveReturnMutation.mutate(row.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </button>
          )}
"""

# Find {isAdminOrHR && ( followed by <button
pattern = r"(\s*\{isAdminOrHR && \(\s*<button)"

if re.search(pattern, content):
    content = re.sub(pattern, "\n" + approveBtn + r"\1", content)
    with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Pattern not found")

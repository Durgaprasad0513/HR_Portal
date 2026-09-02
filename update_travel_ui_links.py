import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace single link display with multiple link display
old_bills_display = """<div><span className="text-gray-500">Bills Link:</span> <a href={selectedRequest?.billUpload} target="_blank" className="text-indigo-600 hover:underline break-all">{selectedRequest?.billUpload}</a></div>"""
new_bills_display = """<div><span className="text-gray-500 block mb-1">Attached Files:</span> 
                <div className="flex flex-col gap-1">
                  {selectedRequest?.billUpload ? selectedRequest.billUpload.split(',').map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm break-all">
                      View File {i + 1}
                    </a>
                  )) : <span className="text-gray-400 text-sm">No files attached</span>}
                </div>
              </div>"""

content = content.replace(old_bills_display, new_bills_display)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated TravelListPage.tsx display")

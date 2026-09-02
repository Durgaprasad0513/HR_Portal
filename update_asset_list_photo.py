import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make handleSubmit async and add photo upload
old_submit_start = "const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {"
new_submit_start = "const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {"
content = content.replace(old_submit_start, new_submit_start)

# Add selectedPhoto state
if "const [selectedPhoto" not in content:
    content = content.replace("const [editingAsset, setEditingAsset] = useState<any>(null);", 
                              "const [editingAsset, setEditingAsset] = useState<any>(null);\n  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);")

# Inject photo upload into payload
old_mutate = """    if (editingAsset) {
      updateMutation.mutate(payload);"""
new_mutate = """    if (selectedPhoto) {
      try {
        const fd = new FormData();
        fd.append('file', selectedPhoto);
        const uploadRes = await assetsApi.uploadPhoto(fd);
        if (uploadRes?.data?.photoUrl) {
          payload.photoUrl = uploadRes.data.photoUrl;
        }
      } catch (err) {
        console.error('Failed to upload photo', err);
      }
    }

    if (editingAsset) {"""
content = content.replace(old_mutate, new_mutate)

# When modal opens for Add or Edit, reset selectedPhoto
content = content.replace("setEditingAsset(null); setIsModalOpen(true);", "setEditingAsset(null); setSelectedPhoto(null); setIsModalOpen(true);")
content = content.replace("setEditingAsset(row);\n                 setIsModalOpen(true);", "setEditingAsset(row);\n                 setSelectedPhoto(null);\n                 setIsModalOpen(true);")

# Add file input to the form
photo_input = """          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset Photo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 dark:file:bg-accent-900 dark:file:text-accent-200"
            />
            {editingAsset?.photoUrl && !selectedPhoto && (
              <div className="mt-2 text-sm text-gray-500">
                <a href={editingAsset.photoUrl} target="_blank" rel="noreferrer" className="text-accent-600 hover:underline">View Current Photo</a>
              </div>
            )}
          </div>"""

# Insert photo_input after assetLocation
content = content.replace("""<Input name="assetLocation" label="Location" placeholder="e.g. Hyderabad Office" />""",
                          """<Input name="assetLocation" label="Location" placeholder="e.g. Hyderabad Office" />\n""" + photo_input)

# Add a view button inside the DataTable action column if photoUrl exists
# Wait, or we can just make the row icon clickable? Or add an Image icon.
action_button_old = """          {row.status === 'IN_USE' && row.assignedEmployee?.id === user?.employeeId && ("""
action_button_new = """          {row.photoUrl && (
            <a 
              href={row.photoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-accent-500 transition-colors" 
              title="View Photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </a>
          )}
          {row.status === 'IN_USE' && row.assignedEmployee?.id === user?.employeeId && ("""
content = content.replace(action_button_old, action_button_new)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AssetListPage.tsx with photo feature")

import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove photoUrl state
content = re.sub(r"const \[selectedPhoto, setSelectedPhoto\] = useState<File \| null>\(null\);\n\s*", "", content)

# 2. Remove photoUrl from payload logic
photo_payload_logic = """    if (selectedPhoto) {
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
    }"""
content = content.replace(photo_payload_logic, "")

# 3. Remove photo input from form
photo_input_logic = """          <div className="flex flex-col">
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
content = content.replace(photo_input_logic, "")

# 4. Remove photo icon from columns
photo_icon_logic = """            {row.photoUrl && (
              <a 
                href={row.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-accent-500 transition-colors" 
                title="View Photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </a>
            )}"""
content = content.replace(photo_icon_logic, "")

# 5. Add "Approve Return" button logic
# Wait, I need an approve mutation! We can just use updateMutation with payload: { status: 'RETURNED', assignedEmployeeId: null }
# But wait, updateMutation uses editingAsset.id. Let's just create an approveReturnMutation!
approve_mutation = """  const approveReturnMutation = useMutation({
    mutationFn: (id: string) => assetsApi.update(id, { status: 'RETURNED', assignedEmployeeId: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Return request approved');
    }
  });"""
if "approveReturnMutation" not in content:
    content = content.replace("const returnMutation = useMutation({", approve_mutation + "\n\n  const returnMutation = useMutation({")

# 6. Add Approve Return button for HR
approve_btn = """            {isAdminOrHR && row.status === 'RETURN_REQUESTED' && (
              <button 
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600 transition-colors" 
                title="Approve Return"
                onClick={() => approveReturnMutation.mutate(row.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </button>
            )}"""

content = content.replace("            {isAdminOrHR && (", approve_btn + "\n            {isAdminOrHR && (")

# 7. Add RETURN_REQUESTED to Badge colors
if "if (row.status === 'RETURN_REQUESTED')" not in content:
    content = content.replace("if (row.status === 'RETURNED')", "if (row.status === 'RETURN_REQUESTED') return <Badge variant=\"warning\">Return Requested</Badge>;\n          if (row.status === 'RETURNED')")
    
# Add RETURN_REQUESTED to the Status Select inside the Edit Modal
content = content.replace('<option value="RETURNED">Returned</option>', '<option value="RETURN_REQUESTED">Return Requested</option>\n                <option value="RETURNED">Returned</option>')

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AssetListPage.tsx completely")

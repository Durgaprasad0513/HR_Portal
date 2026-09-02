import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add editingAsset state
if "const [editingAsset" not in content:
    content = content.replace("const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);", 
                              "const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);\n  const [editingAsset, setEditingAsset] = useState<any>(null);")

# 2. Add update mutation
update_mutation_code = """  const updateMutation = useMutation({
    mutationFn: (payload: any) => assetsApi.update(editingAsset.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setIsModalOpen(false);
      setEditingAsset(null);
    }
  });

  const returnMutation"""
if "const updateMutation" not in content:
    content = content.replace("  const returnMutation", update_mutation_code)

# 3. Handle Submit
old_submit = """    createMutation.mutate(payload);
  };"""

new_submit = """    if (editingAsset) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };"""
content = content.replace(old_submit, new_submit)

# 4. Wire the Settings2 button
old_button = """          {isAdminOrHR && (
             <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-navy-900 dark:text-white transition-colors">
               <Settings2 className="w-4 h-4" />
             </button>
          )}"""

new_button = """          {isAdminOrHR && (
             <button 
               className="p-1 text-gray-400 dark:text-gray-500 hover:text-navy-900 dark:text-white transition-colors"
               onClick={() => {
                 setEditingAsset(row);
                 setIsModalOpen(true);
               }}
             >
               <Settings2 className="w-4 h-4" />
             </button>
          )}"""
content = content.replace(old_button, new_button)

# 5. Make modal title dynamic and reset state on Add
content = content.replace("title=\"Add New Asset\"", "title={editingAsset ? 'Edit Asset' : 'Add New Asset'}")
content = content.replace("<Button onClick={() => setIsModalOpen(true)} className=\"gap-2\">", 
                          "<Button onClick={() => { setEditingAsset(null); setIsModalOpen(true); }} className=\"gap-2\">")

# 6. Populate default values in inputs
# To keep this script manageable, let's just write a helper for defaultValue.
# Wait, defaultValue doesn't auto-update when editingAsset changes unless we use controlled components or a key.
# A simple trick is to add key={editingAsset ? editingAsset.id : 'new'} to the form.
content = content.replace("""<form onSubmit={handleSubmit} className="space-y-4">""", 
                          """<form key={editingAsset ? editingAsset.id : 'new'} onSubmit={handleSubmit} className="space-y-4">""")

# Replace Input and Select with defaultValues
content = re.sub(r'<Select name="([^"]+)"', r'<Select name="\1" defaultValue={editingAsset?.\1 || ""}', content)
content = re.sub(r'<Input name="([^"]+)"', r'<Input name="\1" defaultValue={editingAsset?.\1 || ""}', content)

# But wait, date inputs need to be formatted to YYYY-MM-DD
# Let's fix the date inputs specifically
content = content.replace("""defaultValue={editingAsset?.purchaseDate || ""}""", """defaultValue={editingAsset?.purchaseDate ? new Date(editingAsset.purchaseDate).toISOString().split('T')[0] : ""}""")
content = content.replace("""defaultValue={editingAsset?.issueDate || ""}""", """defaultValue={editingAsset?.issueDate ? new Date(editingAsset.issueDate).toISOString().split('T')[0] : ""}""")

# 7. Add Status dropdown for editing
# Find the end of the form grid and insert Status
status_select = """
          {editingAsset && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <Select name="status" defaultValue={editingAsset.status} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="IN_USE">In Use</option>
                <option value="RETURNED">Returned</option>
                <option value="DAMAGED">Damaged</option>
                <option value="LOST">Lost</option>
                <option value="RETIRED">Retired</option>
              </Select>
            </div>
          )}
"""
content = content.replace("""<div className="flex justify-end space-x-2 pt-4">""", status_select + """\n          <div className="flex justify-end space-x-2 pt-4">""")

# In handleSubmit, we need to extract status
# if (formData.get('status')) payload.status = formData.get('status');
content = content.replace("""if (formData.get('issueCondition')) payload.issueCondition = formData.get('issueCondition');""",
                          """if (formData.get('issueCondition')) payload.issueCondition = formData.get('issueCondition');\n    if (formData.get('status')) payload.status = formData.get('status');""")

# Also fix the button text
content = content.replace("""{createMutation.isPending ? 'Saving...' : 'Add Asset'}""", 
                          """{createMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingAsset ? 'Save Changes' : 'Add Asset')}""")
content = content.replace("""disabled={createMutation.isPending}""", """disabled={createMutation.isPending || updateMutation.isPending}""")

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AssetListPage.tsx completely")

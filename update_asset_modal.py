import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the modal content
old_modal = r'<Modal isOpen={isModalOpen} onClose=\{\(\) => setIsModalOpen\(false\)\} title="Add New Asset">.*?<\/Modal>'
new_modal = """<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset Type</label>
              <Select name="assetType" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="LAPTOP">Laptop</option>
                <option value="DESKTOP">Desktop</option>
                <option value="MOBILE">Mobile</option>
                <option value="SIM">SIM</option>
                <option value="ID_CARD">ID Card</option>
                <option value="LAPTOP_BAG">Laptop Bag</option>
                <option value="VEHICLE">Vehicle</option>
                <option value="TOOLS">Tools</option>
                <option value="MACHINERY_TOOL">Machinery-related tools</option>
                <option value="ASSET_OTHER">Other company assets</option>
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <Select name="assetCategory" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="IT">IT Equipment</option>
                <option value="NON_IT">Non-IT</option>
                <option value="VEHICLE_CAT">Vehicle</option>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input name="brandModel" label="Brand & Model" placeholder="e.g. MacBook Pro 16" required />
            <Input name="serialNumber" label="Serial/ID Number" required />
            <Input name="purchaseDate" label="Purchase Date" type="date" />
            <Input name="purchaseValue" label="Purchase Value" type="number" step="0.01" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To (Optional)</label>
              <Select name="assignedEmployeeId" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="">Unassigned</option>
                {empData?.data?.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </Select>
            </div>
            <Input name="assetLocation" label="Location" placeholder="e.g. Hyderabad Office" />
            <Input name="issueDate" label="Issue Date" type="date" />
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Condition</label>
              <Select name="issueCondition" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option value="">Select Condition</option>
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </Modal>"""

content = re.sub(old_modal, new_modal, content, flags=re.DOTALL)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated modal in AssetListPage")

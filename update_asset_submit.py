import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_submit = """  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assignedEmployeeId = formData.get('assignedEmployeeId') as string;
    createMutation.mutate({
      assetType: formData.get('assetType'),
      assetCategory: formData.get('assetCategory'),
      brandModel: formData.get('brandModel'),
      serialNumber: formData.get('serialNumber'),
      purchaseValue: Number(formData.get('purchaseValue')),
      ...(assignedEmployeeId ? { assignedEmployeeId, status: 'IN_USE' } : {})
    });
  };"""

new_submit = """  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assignedEmployeeId = formData.get('assignedEmployeeId') as string;
    
    const payload: any = {
      assetType: formData.get('assetType'),
      assetCategory: formData.get('assetCategory'),
      brandModel: formData.get('brandModel'),
      serialNumber: formData.get('serialNumber'),
    };
    
    if (formData.get('purchaseValue')) payload.purchaseValue = Number(formData.get('purchaseValue'));
    if (formData.get('purchaseDate')) payload.purchaseDate = new Date(formData.get('purchaseDate') as string).toISOString();
    if (formData.get('issueDate')) payload.issueDate = new Date(formData.get('issueDate') as string).toISOString();
    if (formData.get('assetLocation')) payload.assetLocation = formData.get('assetLocation');
    if (formData.get('issueCondition')) payload.issueCondition = formData.get('issueCondition');

    if (assignedEmployeeId) {
      payload.assignedEmployeeId = assignedEmployeeId;
      payload.status = 'IN_USE';
    }

    createMutation.mutate(payload);
  };"""

content = content.replace(old_submit, new_submit)

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AssetListPage.tsx submit handler")

import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_mutation = """  const returnMutation = useMutation({
    mutationFn: (id: string) => assetsApi.returnAsset(id, { returnCondition: 'RETURN_GOOD' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setReturnConfirmOpen(false);
    }
  });"""

new_mutation = """  const returnMutation = useMutation({
    mutationFn: (id: string) => assetsApi.returnAsset(id, { returnCondition: 'RETURN_GOOD' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setReturnConfirmOpen(false);
      toast.success('Asset returned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to return asset');
    }
  });"""

content = content.replace(old_mutation, new_mutation)

if "import toast" not in content and "import { toast }" not in content:
    content = "import toast from 'react-hot-toast';\n" + content

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

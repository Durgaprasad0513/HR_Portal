import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "import toast" not in content:
    content = content.replace("import { FileUpload } from '@/components/ui/FileUpload';", "import { FileUpload } from '@/components/ui/FileUpload';\nimport toast from 'react-hot-toast';")

# Add onError to createMutation and use toast
create_mutation_old = """  const createMutation = useMutation({
    mutationFn: (payload: any) => travelApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setIsModalOpen(false);
    }
  });"""
create_mutation_new = """  const createMutation = useMutation({
    mutationFn: (payload: any) => travelApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setIsModalOpen(false);
      toast.success('Travel request submitted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit travel request');
    }
  });"""
content = content.replace(create_mutation_old, create_mutation_new)

# Replace alerts with toasts
content = content.replace("alert(error.response?.data?.message || 'Failed to update approval');", "toast.error(error.response?.data?.message || 'Failed to update approval');")
content = content.replace("alert(error.response?.data?.message || 'Failed to submit expenses');", "toast.error(error.response?.data?.message || 'Failed to submit expenses');")
content = content.replace("alert(error.response?.data?.message || 'Failed to settle claim');", "toast.error(error.response?.data?.message || 'Failed to settle claim');")

# Also add success toasts to the others
content = content.replace("setApprovalModalOpen(false);\n    },", "setApprovalModalOpen(false);\n      toast.success('Approval updated');\n    },")
content = content.replace("setExpenseModalOpen(false);\n    },", "setExpenseModalOpen(false);\n      toast.success('Expenses submitted');\n    },")
content = content.replace("setSettleModalOpen(false);\n    },", "setSettleModalOpen(false);\n      toast.success('Claim settled');\n    },")

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added error handling to TravelListPage!")

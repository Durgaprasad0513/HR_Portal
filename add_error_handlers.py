import re

with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add onError to approveMutation
content = content.replace(
    """    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setApprovalModalOpen(false);
    }
  });""",
    """    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setApprovalModalOpen(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update approval');
    }
  });"""
)

# Add onError to expenseMutation
content = content.replace(
    """    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setExpenseModalOpen(false);
    }
  });""",
    """    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setExpenseModalOpen(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to submit expenses');
    }
  });"""
)

# Add onError to settleMutation
content = content.replace(
    """    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setSettleModalOpen(false);
    }
  });""",
    """    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel'] });
      setSettleModalOpen(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to settle claim');
    }
  });"""
)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added error handlers")

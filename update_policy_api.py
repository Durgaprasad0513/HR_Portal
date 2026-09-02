import re

with open("client/src/api/policies.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "getMyAcknowledgements: async () => {",
    """getAcknowledgements: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<any[]>>(`/policies/${id}/acknowledgements`);
    return data;
  },
  getMyAcknowledgements: async () => {"""
)

with open("client/src/api/policies.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated API endpoints")

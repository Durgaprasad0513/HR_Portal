import re

with open('client/src/api/recruitment.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '  getCandidates: async (id: string) => {',
    '  getInterviews: async () => {\n    const { data } = await apiClient.get<ApiResponse<any[]>>(\'/recruitment/interviews\');\n    return data;\n  },\n  getCandidates: async (id: string) => {'
)

with open('client/src/api/recruitment.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated client API")

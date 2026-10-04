import re

with open('client/src/api/recruitment.ts', 'r', encoding='utf-8') as f:
    content = f.read()

get_interviews_code = """  getInterviews: async () => {
    const { data } = await apiClient.get<ApiResponse<any[]>>('/recruitment/interviews');
    return data;
  },
"""

content = content.replace(
    'export const recruitmentApi = {',
    'export const recruitmentApi = {\n' + get_interviews_code
)

with open('client/src/api/recruitment.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed API again")

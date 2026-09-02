import re

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the useQuery block
old_query = """  const { data, isLoading } = useQuery({
    queryKey: ['requisitions'],
    queryFn: () => recruitmentApi.getRequisitions().then(res => res.data),
  });"""

new_query = """  const { data: reqResponse, isLoading } = useQuery({
    queryKey: ['requisitions'],
    queryFn: recruitmentApi.getRequisitions,
  });
  
  const data = reqResponse?.data || [];"""

content = content.replace(old_query, new_query)

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed RecruitmentPage.tsx queryFn cache poisoning")

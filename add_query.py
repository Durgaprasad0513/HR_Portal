import re

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add candidatesData useQuery right after reqResponse useQuery
req_query = """  const { data: reqResponse, isLoading } = useQuery({
    queryKey: ['requisitions'],
    queryFn: recruitmentApi.getRequisitions,
  });"""

candidates_query = """
  const { data: candidatesResponse, isLoading: isCandidatesLoading } = useQuery({
    queryKey: ['candidates', selectedReq?.id],
    queryFn: () => recruitmentApi.getCandidates(selectedReq!.id),
    enabled: !!selectedReq,
  });
  const candidatesData = candidatesResponse?.data || [];
"""

content = content.replace(req_query, req_query + candidates_query)

with open("client/src/pages/recruitment/RecruitmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added candidatesData useQuery")

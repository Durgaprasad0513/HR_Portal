export function candidateDetailsUrl(requisitionId: string, candidateId: string): string {
  const params = new URLSearchParams({ tab: "pipeline", opening: requisitionId, reqId: requisitionId, candidateId });
  return `/recruitment?${params}`;
}

export function normalizeRecruitmentSearch(search: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(search);
  const tab = next.get("tab");
  const requisitionId = next.get("reqId");
  if (requisitionId && next.get("candidateId")) {
    next.set("tab", "pipeline");
    next.set("opening", requisitionId);
  } else if (tab === "candidates" || tab === "pipeline") {
    const opening = next.get("opening") || requisitionId;
    next.set("tab", opening ? "pipeline" : "openings");
    if (opening) next.set("opening", opening);
    next.delete("reqId");
    next.delete("candidateId");
  } else if (tab && !["openings", "history"].includes(tab)) {
    next.set("tab", "openings");
  }
  return next;
}

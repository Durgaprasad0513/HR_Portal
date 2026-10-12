export const CANDIDATE_STAGES = [
  { value: "SCREENING", label: "Screening" },
  { value: "TELEPHONIC", label: "Telephonic" },
  { value: "HR_INTERVIEW", label: "HR interview" },
  { value: "TECHNICAL", label: "Technical interview" },
  { value: "MANAGEMENT", label: "Management interview" },
  { value: "OFFER", label: "Offer" },
  { value: "JOINED", label: "Joined" },
];

export const stageLabel = (stage: string) =>
  CANDIDATE_STAGES.find((item) => item.value === stage)?.label || "Stage unavailable";

export function candidateNextAction(candidate: any, now = Date.now()): string {
  if (candidate.joiningStatus === "JOINED") return "Hiring completed";
  if (candidate.screeningStatus === "SCREENING_REJECTED" || candidate.selectionStatus === "SELECTION_REJECTED") return "Rejected";
  if (candidate.selectionStatus === "SELECTION_ON_HOLD") return "On hold — review decision";
  if (candidate.offerStatus === "OFFER_DECLINED" || candidate.joiningStatus === "NOT_JOINED") return "Review hiring outcome";
  if (candidate.offerStatus === "OFFER_ACCEPTED") return "Confirm joining";
  if (candidate.offerStatus === "RELEASED") return "Await offer response";
  if (candidate.selectionStatus === "SELECTED" || candidate.currentStage === "OFFER") return "Manage offer";
  if (candidate.screeningStatus === "SCREENING_PENDING") return "Complete screening";
  if (candidate.currentStage === "SCREENING") return "Advance or schedule first interview";
  const interviews = candidate.interviews || [];
  if (interviews.some((item: any) => item.status === "COMPLETED" && !item.feedbackSubmittedAt)) return "Submit interview feedback";
  const next = interviews.find((item: any) => item.status === "SCHEDULED");
  if (next) return new Date(next.startsAt).getTime() < now ? "Interview overdue — update status" : "Interview scheduled";
  if (interviews.some((item: any) => item.round === candidate.currentStage && item.feedbackSubmittedAt)) return "Review feedback and advance";
  return "Schedule interview";
}

export function stageAge(enteredAt?: string, now = Date.now()) {
  if (!enteredAt || !Number.isFinite(new Date(enteredAt).getTime())) return null;
  return Math.max(0, Math.floor((now - new Date(enteredAt).getTime()) / 86400000));
}

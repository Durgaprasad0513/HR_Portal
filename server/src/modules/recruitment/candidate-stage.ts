import { candidateStages } from "./recruitment.schema";

export function assertStageTransition(candidate: {
  currentStage: string; screeningStatus: string; selectionStatus: string | null; offerStatus?: string | null; joiningStatus?: string;
}, stage: string, reason: string | undefined, hasSubmittedFeedback: boolean, hasLockedPriorFeedback = false) {
  const from = candidateStages.indexOf(candidate.currentStage as typeof candidateStages[number]);
  const to = candidateStages.indexOf(stage as typeof candidateStages[number]);
  if (from < 0 || to < 0) throw new Error("Unknown recruitment stage.");
  if (candidate.selectionStatus === "SELECTION_REJECTED" || candidate.screeningStatus === "SCREENING_REJECTED")
    throw new Error("Restore the rejected candidate before moving their stage.");
  if (candidate.selectionStatus === "SELECTION_ON_HOLD" || candidate.offerStatus === "OFFER_DECLINED" || candidate.joiningStatus === "NOT_JOINED")
    throw new Error("Restore the candidate's decision before moving their stage.");
  if (stage !== "SCREENING" && candidate.screeningStatus !== "SHORTLISTED")
    throw new Error("Shortlist the candidate before moving beyond screening.");
  if (stage === "OFFER" && candidate.selectionStatus !== "SELECTED")
    throw new Error("Select the candidate before moving to offer.");
  if (stage === candidate.currentStage) return;
  if (to < from && hasLockedPriorFeedback)
    throw new Error("A completed interview stage is locked after feedback is submitted.");
  if (stage === "JOINED") throw new Error("Record joining through the accepted offer workflow.");
  if (candidate.currentStage === "JOINED") throw new Error("A joined candidate cannot move back into recruitment.");
  if (to !== from + 1 && !reason?.trim())
    throw new Error("A reason is required to skip stages or move backwards.");
  if (to > from && from >= 1 && from <= 4 && !hasSubmittedFeedback)
    throw new Error("Submit feedback for the current interview round before advancing.");
}

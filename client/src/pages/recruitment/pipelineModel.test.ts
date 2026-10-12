import { describe, expect, it } from "vitest";
import { candidateNextAction, stageAge } from "./pipelineModel";

describe("pipeline next actions", () => {
  it("keeps rejection and joining outcomes ahead of appointments", () => {
    const interviews = [{ status: "SCHEDULED", startsAt: "2026-10-10T00:00:00Z" }];
    expect(candidateNextAction({ selectionStatus: "SELECTION_REJECTED", interviews })).toBe("Rejected");
    expect(candidateNextAction({ joiningStatus: "JOINED", interviews })).toBe("Hiring completed");
  });
  it("never treats draft feedback as submitted or a missing appointment as Telephonic", () => {
    expect(candidateNextAction({ screeningStatus: "SHORTLISTED", currentStage: "TECHNICAL", interviews: [{ round: "TECHNICAL", status: "COMPLETED", feedback: "Draft" }] })).toBe("Submit interview feedback");
    expect(candidateNextAction({ screeningStatus: "SCREENING_PENDING" })).toBe("Complete screening");
  });
  it("flags overdue appointments and distinguishes submitted feedback", () => {
    expect(candidateNextAction({ screeningStatus: "SHORTLISTED", interviews: [{ status: "SCHEDULED", startsAt: "2026-10-10T00:00:00Z" }] }, Date.parse("2026-10-11T00:00:00Z"))).toContain("overdue");
    expect(candidateNextAction({ screeningStatus: "SHORTLISTED", currentStage: "TECHNICAL", interviews: [{ round: "TECHNICAL", status: "COMPLETED", feedbackSubmittedAt: "2026-10-10" }] })).toBe("Review feedback and advance");
  });
  it("does not invent age for unknown dates", () => {
    expect(stageAge(undefined)).toBeNull();
    expect(stageAge("invalid")).toBeNull();
    expect(stageAge("2026-10-10T00:00:00Z", Date.parse("2026-10-12T00:00:00Z"))).toBe(2);
  });
});

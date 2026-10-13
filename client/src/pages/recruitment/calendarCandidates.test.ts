import { describe, expect, it } from "vitest";
import { calendarCandidates, isHiringHistory } from "./calendarCandidates";

const interview = (id: string, round: string, status: string, date: string) => ({
  id, round, status, startsAt: date, createdAt: date,
});

describe("candidate calendar cards", () => {
  it("replaces the previous round with the current round on a single candidate card", () => {
    const result = calendarCandidates([{ id: "candidate", currentStage: "HR_INTERVIEW", interviews: [
      interview("phone", "TELEPHONIC", "COMPLETED", "2030-01-01"),
      interview("hr-cancelled", "HR_INTERVIEW", "CANCELLED", "2030-01-03"),
      interview("hr", "HR_INTERVIEW", "SCHEDULED", "2030-01-04"),
    ] }]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "candidate", interviewId: "hr", status: "SCHEDULED" });
  });

  it("supports flattened API records without duplicating the candidate", () => {
    const result = calendarCandidates([
      { id: "candidate", currentStage: "TECHNICAL", interviewId: "hr", interviewRound: "HR_INTERVIEW", status: "COMPLETED", interviewDate: "2030-01-01" },
      { id: "candidate", currentStage: "TECHNICAL", interviewId: "tech", interviewRound: "TECHNICAL", status: "SCHEDULED", interviewDate: "2030-01-02" },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].interviewId).toBe("tech");
  });

  it("updates a completed interview on the same candidate card", () => {
    const candidate = { id: "candidate", currentStage: "TELEPHONIC", interviews: [interview("phone", "TELEPHONIC", "SCHEDULED", "2030-01-01")] };
    expect(calendarCandidates([candidate])[0].status).toBe("SCHEDULED");
    expect(calendarCandidates([{ ...candidate, interviews: [{ ...candidate.interviews[0], status: "COMPLETED" }] }])[0]).toMatchObject({ id: "candidate", interviewId: "phone", status: "COMPLETED" });
  });

  it("keeps selected candidates active until joining and archives terminal outcomes", () => {
    expect(isHiringHistory({ selectionStatus: "SELECTED", offerStatus: "OFFER_ACCEPTED", joiningStatus: "PENDING" })).toBe(false);
    expect(isHiringHistory({ selectionStatus: "SELECTED", joiningStatus: "JOINED" })).toBe(true);
    expect(isHiringHistory({ selectionStatus: "SELECTION_REJECTED" })).toBe(true);
    expect(isHiringHistory({ screeningStatus: "SCREENING_REJECTED" })).toBe(true);
  });

  it("does not restore an older scheduled card after the latest appointment completes", () => {
    const cards = calendarCandidates([{ id: "candidate", currentStage: "HR_INTERVIEW", interviews: [
      interview("old", "HR_INTERVIEW", "SCHEDULED", "2030-01-01"),
      interview("latest", "HR_INTERVIEW", "COMPLETED", "2030-01-02"),
    ] }]);
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ interviewId: "latest", status: "COMPLETED" });
  });
});

import { assertStageTransition } from "../src/modules/recruitment/candidate-stage";
import { candidateStageSchema } from "../src/modules/recruitment/recruitment.schema";

const screening = {currentStage: "TELEPHONIC", selectionStatus: null};
describe("Authoritative recruitment stage guards", () => {
  test("does not infer a stage from missing appointments", () => {
    expect(() => assertStageTransition(screening, "HR_INTERVIEW", undefined, false)).not.toThrow();
    expect(candidateStageSchema.safeParse({stage: "SCREENING", expectedStage: "TELEPHONIC"}).success).toBe(false);
  });
  test("skip and backward changes require a reason", () => {
    expect(() => assertStageTransition(screening, "TECHNICAL", undefined, false)).toThrow("reason");
    expect(() => assertStageTransition(screening, "TECHNICAL", "Role has no phone or HR assessment", false)).not.toThrow();
    expect(() => assertStageTransition({...screening, currentStage: "TECHNICAL"}, "TELEPHONIC", undefined, true)).toThrow("reason");
  });
  test("a previously completed interview stage locks backward transitions", () => {
    expect(() => assertStageTransition({...screening, currentStage: "TECHNICAL"}, "HR_INTERVIEW", "Reopen", true, true))
      .toThrow("completed interview stage is locked");
    expect(() => assertStageTransition({...screening, currentStage: "TECHNICAL"}, "HR_INTERVIEW", "Reopen", true, false))
      .not.toThrow();
  });
  test("even a reason cannot replace submitted evaluation", () => {
    expect(() => assertStageTransition({...screening, currentStage: "HR_INTERVIEW"}, "TECHNICAL", "Advance", false)).toThrow("Submit feedback");
    expect(() => assertStageTransition({...screening, currentStage: "TELEPHONIC"}, "HR_INTERVIEW", undefined, true)).not.toThrow();
  });
  test("selection precedes offer and joining uses only the offer workflow", () => {
    expect(() => assertStageTransition({...screening, currentStage: "MANAGEMENT"}, "OFFER", undefined, true)).toThrow("Select");
    expect(() => assertStageTransition({...screening, currentStage: "MANAGEMENT", selectionStatus: "SELECTED"}, "OFFER", undefined, true)).not.toThrow();
    expect(() => assertStageTransition({...screening, currentStage: "OFFER", selectionStatus: "SELECTED"}, "JOINED", undefined, true)).toThrow("accepted offer");
  });
  test.each([
    {selectionStatus: "SELECTION_REJECTED"}, {selectionStatus: "SELECTION_ON_HOLD"},
    {offerStatus: "OFFER_DECLINED"}, {joiningStatus: "NOT_JOINED"},
  ])("inactive decisions block stage advance: %j", (outcome) => {
    expect(() => assertStageTransition({...screening, ...outcome}, "TELEPHONIC", undefined, true)).toThrow("Restore");
    expect(() => assertStageTransition({...screening, ...outcome}, "TELEPHONIC", undefined, true)).toThrow("Restore");
  });
  test("joining cannot be undone by stage moves", () => {
    expect(() => assertStageTransition({...screening, currentStage: "JOINED"}, "TELEPHONIC", "Restart", true)).toThrow("joined candidate");
  });
  test("transition requests require an expected stage and reject unknown stages", () => {
    expect(candidateStageSchema.safeParse({stage: "TELEPHONIC"}).success).toBe(false);
    expect(candidateStageSchema.safeParse({stage: "MADE_UP", expectedStage: "TELEPHONIC"}).success).toBe(false);
  });
});

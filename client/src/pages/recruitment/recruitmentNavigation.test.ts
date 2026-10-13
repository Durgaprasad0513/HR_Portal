import { describe, expect, it } from "vitest";
import { candidateDetailsUrl, normalizeRecruitmentSearch } from "./recruitmentNavigation";

describe("recruitment navigation", () => {
  it("redirects the removed global candidate register to openings", () => {
    const result = normalizeRecruitmentSearch(new URLSearchParams("tab=candidates"));
    expect(result.get("tab")).toBe("openings");
  });

  it("preserves legacy candidate detail links in their position pipeline", () => {
    const result = normalizeRecruitmentSearch(new URLSearchParams("tab=candidates&reqId=position&candidateId=applicant"));
    expect(Object.fromEntries(result)).toEqual({ tab: "pipeline", opening: "position", reqId: "position", candidateId: "applicant" });
  });

  it("does not expose a global pipeline without a position", () => {
    expect(normalizeRecruitmentSearch(new URLSearchParams("tab=pipeline")).get("tab")).toBe("openings");
    expect(normalizeRecruitmentSearch(new URLSearchParams("tab=pipeline&opening=position")).get("tab")).toBe("pipeline");
  });

  it("new candidate links use the position pipeline instead of the removed tab", () => {
    const url = candidateDetailsUrl("position & one", "applicant/one");
    const params = new URLSearchParams(url.split("?")[1]);
    expect(Object.fromEntries(params)).toEqual({ tab: "pipeline", opening: "position & one", reqId: "position & one", candidateId: "applicant/one" });
  });
});

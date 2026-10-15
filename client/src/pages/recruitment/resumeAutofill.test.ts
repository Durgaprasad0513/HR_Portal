import { describe, expect, it } from "vitest";
import { extractResumeFields, pdfItemsToText } from "./resumeAutofill";

describe("resume autofill extraction", () => {
  it("extracts common candidate details from readable resume text", () => {
    const fields = extractResumeFields(`
      Ananya Patel
      ananya.patel@example.com
      +91 98765 43210
      Qualification: B.Tech Computer Science
      Total Experience: 4.5 years
      Current Company: Acme Technologies
      Notice Period: 30 days
    `);

    expect(fields).toEqual({
      candidateName: "Ananya Patel",
      email: "ananya.patel@example.com",
      mobile: "+91 98765 43210",
      qualification: "B.Tech Computer Science",
      totalExperience: "4.5",
      currentCompany: "Acme Technologies",
      noticePeriod: "30",
    });
  });

  it("leaves fields blank when the resume has no supported text", () => {
    expect(extractResumeFields("Scanned document without extractable text")).toEqual({});
  });
});

describe("PDF resume layout", () => {
  it("preserves line endings so a degree does not consume the whole resume", () => {
    const text = pdfItemsToText([{str:"Ananya Patel"}, {str:"",hasEOL:true}, {str:"EDUCATION",hasEOL:true}, {str:"B.Tech in Computer Science and Engineering"}, {str:" August 2021 – April 2025",hasEOL:true}, {str:"SKILLS",hasEOL:true}, {str:"Python, SQL"}]);
    expect(extractResumeFields(text)).toMatchObject({candidateName:"Ananya Patel", qualification:"B.Tech in Computer Science and Engineering"});
    expect(extractResumeFields(text).totalExperience).toBeUndefined();
    expect(extractResumeFields(text).noticePeriod).toBeUndefined();
  });
});

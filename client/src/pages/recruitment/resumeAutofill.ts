import mammoth from "mammoth";
import * as pdfjsModule from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

const pdfjs = pdfjsModule as any;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type ResumeFields = Partial<{
  candidateName: string;
  email: string;
  mobile: string;
  qualification: string;
  totalExperience: string;
  currentCompany: string;
  noticePeriod: string;
}>;

const cleanLine = (line: string) => line.replace(/[|•·]/g, " ").replace(/\s+/g, " ").trim();

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = cleanLine(match?.[1] || "");
    if (value) return value.replace(/[;,|]+$/, "").trim();
  }
  return undefined;
}

export function extractResumeFields(rawText: string): ResumeFields {
  const text = rawText.replace(/\r/g, "\n").replace(/[\t\u00a0]+/g, " ");
  const lines = text.split(/\n+/).map(cleanLine).filter(Boolean);
  const email = text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0];
  const mobile = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim();
  const candidateName = lines.find((line) => {
    const words = line.split(/\s+/);
    return line.length <= 70 &&
      words.length >= 2 && words.length <= 5 &&
      words.every((word) => /^[A-Z][A-Za-z.'-]*$/.test(word)) &&
      !/^(resume|curriculum vitae|profile|contact|summary|experience|education|skills|objective)$/i.test(line);
  });

  const qualification = firstMatch(text, [
    /(?:qualification|highest education|degree)\s*[:-]\s*([^\n]{2,100})/i,
    /(?:education)\s*[:-]\s*([^\n]{2,100})/i,
  ]) || lines.find((line) => /\b(B\.?Tech|M\.?Tech|B\.?E\.?|M\.?B\.?A\.?|B\.?Sc|M\.?Sc|BCA|MCA|Bachelor|Master|Diploma|Ph\.D)\b/i.test(line));
  const experienceValue = firstMatch(text, [
    /(?:total\s+)?(?:experience|work experience)\s*[:-]?\s*(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/i,
    /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i,
  ]);
  const currentCompany = firstMatch(text, [
    /(?:current company|currently working at|employer)\s*[:-]\s*([^\n]{2,100})/i,
  ]);
  const noticePeriod = firstMatch(text, [
    /(?:notice period|availability)\s*[:-]\s*(\d+)\s*days?/i,
    /(?:notice period|availability)\s*[:-]\s*(immediate)/i,
  ]);

  return {
    ...(candidateName ? { candidateName } : {}),
    ...(email ? { email } : {}),
    ...(mobile ? { mobile } : {}),
    ...(qualification ? { qualification: qualification.replace(/\s+(?:(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+)?(?:19|20)\d{2}.*$/i, "").trim() } : {}),
    ...(experienceValue ? { totalExperience: experienceValue } : {}),
    ...(currentCompany ? { currentCompany } : {}),
    ...(noticePeriod ? { noticePeriod: /^immediate$/i.test(noticePeriod) ? "0" : noticePeriod } : {}),
  };
}

export function pdfItemsToText(items: Array<{ str?: string; hasEOL?: boolean }>): string {
  return items.map((item) => `${item.str || ""}${item.hasEOL ? "\n" : " "}`).join("");
}

async function extractPdfText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(pdfItemsToText(content.items));
  }
  return pages.join("\n");
}

export async function readResumeText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf" || file.type === "application/pdf") return extractPdfText(file);
  if (extension === "docx" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }
  throw new Error("Choose a PDF or DOCX resume.");
}

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidatePipeline } from "./CandidatePipeline";
import { CandidateStageControls } from "./CandidateStageControls";

vi.mock("@/api/recruitment", () => ({ recruitmentApi: {
  getPipeline: vi.fn(async () => ({ data: { columns: [{ stage: "SCREENING", total: 104, truncated: true, items: [{ id: "qa", candidateName: "QA Candidate", requisitionId: "opening", currentStage: "SCREENING", screeningStatus: "SCREENING_PENDING", requisition: { positionTitle: "Developer" } }] }] } })),
  moveCandidateStage: vi.fn(),
} }));

function wrapper(children: React.ReactNode) {
  return <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter initialEntries={["/recruitment?tab=pipeline&q=QA"]}>{children}</MemoryRouter></QueryClientProvider>;
}

describe("pipeline access and complete counts", () => {
  it("shows server total rather than loaded card count and preserves filters in detail links", async () => {
    render(wrapper(<CandidatePipeline requisitions={[]} />));
    const link = await screen.findByRole("link", { name: /QA Candidate/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("q=QA"));
    expect(link).toHaveAttribute("href", expect.stringContaining("candidateId=qa"));
    expect(screen.getByText("104")).toBeInTheDocument();
    expect(screen.getByText(/Showing the first 100/)).toBeInTheDocument();
  });
  it("does not expose stage mutation controls to a read-only manager", () => {
    render(wrapper(<CandidateStageControls editable={false} candidate={{ id: "qa", currentStage: "SCREENING", stageHistory: [{ id: "event", fromStage: "SCREENING", toStage: "TELEPHONIC", reason: "Shortlist reviewed", createdAt: "2026-10-12T09:00:00Z" }] }} />));
    expect(screen.queryByRole("button", { name: "Move stage" })).toBeNull();
    expect(screen.getByText("Shortlist reviewed")).toBeInTheDocument();
  });
});

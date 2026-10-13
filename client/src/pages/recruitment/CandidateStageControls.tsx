import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { recruitmentApi } from "@/api/recruitment";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CANDIDATE_STAGES, stageLabel } from "./pipelineModel";

type StageControlsProps = { candidate: any; editable: boolean; onOpenJoining?: () => void };

export function CandidateStageControls({ candidate, editable, onOpenJoining }: StageControlsProps) {
  return <StageEditor key={`${candidate.id}:${candidate.currentStage}`} candidate={candidate} editable={editable} onOpenJoining={onOpenJoining} />;
}

function StageEditor({ candidate, editable, onOpenJoining }: StageControlsProps) {
  const cache = useQueryClient();
  const current = candidate.currentStage || "SCREENING";
  const nextStage = CANDIDATE_STAGES[CANDIDATE_STAGES.findIndex(stage => stage.value === current) + 1];
  const [target, setTarget] = useState(nextStage?.value !== "JOINED" ? nextStage?.value || "" : "");
  const [reason, setReason] = useState("");
  const needsReason = !!target && CANDIDATE_STAGES.findIndex((stage) => stage.value === target) !== CANDIDATE_STAGES.findIndex((stage) => stage.value === current) + 1;
  const mutation = useMutation({
    mutationFn: () => recruitmentApi.moveCandidateStage(candidate.id, { stage: target, expectedStage: current, reason: reason || undefined }),
    onSuccess: () => {
      ["candidates", "candidate-register", "candidate-pipeline", "interviews", "requisitions", "dashboard-stats"].forEach((key) => cache.invalidateQueries({ queryKey: [key] }));
      toast.success("Candidate stage updated");
    },
    onError: (error: any) => {
      cache.invalidateQueries({ queryKey: ["candidates"] });
      toast.error(error?.response?.data?.message || "Could not update stage");
    },
  });
  const terminal = candidate.selectionStatus === "SELECTION_REJECTED" || candidate.screeningStatus === "SCREENING_REJECTED" || candidate.joiningStatus === "JOINED";
  return <div className="space-y-4">
    {editable && !terminal && current === "OFFER" && onOpenJoining && (
      <div className="rounded-xl border border-slate-border bg-tint p-4">
        <Button type="button" onClick={onOpenJoining}>Move to joining</Button>
      </div>
    )}
    {editable && !terminal && current !== "OFFER" && (
      <form className="space-y-3 rounded-xl border border-slate-border bg-tint p-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <h3 className="font-semibold">Continue from {stageLabel(current)}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Destination stage" required value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="">Choose stage</option>
            {CANDIDATE_STAGES.filter((stage) => stage.value !== "JOINED" && stage.value !== current).map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
          </Select>
          <Input label={needsReason ? "Reason for skipping or returning (required)" : "Reason (optional)"} required={needsReason} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={1000} />
        </div>
        <Button type="submit" disabled={!target || mutation.isPending}>{mutation.isPending ? "Updating…" : target ? `Move to ${stageLabel(target)}` : "Move stage"}</Button>
      </form>
    )}
    <details className="rounded-xl border border-slate-border p-4">
      <summary className="cursor-pointer font-semibold">Stage history</summary>
    <section aria-label="Stage history" className="mt-3 space-y-2">
      {candidate.stageHistory?.length ? <ol className="space-y-2">{candidate.stageHistory.map((event: any) => <li key={event.id} className="rounded-lg bg-tint p-3 text-sm">
        <p>{stageLabel(event.fromStage)} → {stageLabel(event.toStage)}</p>
        {event.reason && <p className="mt-1 whitespace-pre-wrap text-text-muted">{event.reason}</p>}
        <p className="mt-1 text-xs text-text-muted">{new Date(event.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} · Asia/Kolkata</p>
      </li>)}</ol> : <p className="text-sm text-text-muted">No recorded stage moves. Historical transitions have not been inferred.</p>}
    </section>
    </details>
  </div>;
}

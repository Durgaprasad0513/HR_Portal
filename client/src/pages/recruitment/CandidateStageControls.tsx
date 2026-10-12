import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { recruitmentApi } from "@/api/recruitment";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CANDIDATE_STAGES, stageLabel } from "./pipelineModel";

export function CandidateStageControls({ candidate, editable }: { candidate: any; editable: boolean }) {
  return <StageEditor key={`${candidate.id}:${candidate.currentStage}`} candidate={candidate} editable={editable} />;
}

function StageEditor({ candidate, editable }: { candidate: any; editable: boolean }) {
  const cache = useQueryClient();
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const current = candidate.currentStage || "SCREENING";
  const needsReason = !!target && CANDIDATE_STAGES.findIndex((stage) => stage.value === target) !== CANDIDATE_STAGES.findIndex((stage) => stage.value === current) + 1;
  const mutation = useMutation({
    mutationFn: () => recruitmentApi.moveCandidateStage(candidate.id, { stage: target, expectedStage: current, reason: reason || undefined }),
    onSuccess: () => {
      ["candidates", "candidate-register", "candidate-pipeline"].forEach((key) => cache.invalidateQueries({ queryKey: [key] }));
      toast.success("Candidate stage updated");
    },
    onError: (error: any) => {
      cache.invalidateQueries({ queryKey: ["candidates"] });
      toast.error(error?.response?.data?.message || "Could not update stage");
    },
  });
  const terminal = candidate.selectionStatus === "SELECTION_REJECTED" || candidate.screeningStatus === "SCREENING_REJECTED" || candidate.joiningStatus === "JOINED";
  return <div className="space-y-4">
    {editable && !terminal && (
      <form className="space-y-3 rounded-xl border border-slate-border bg-tint p-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <h3 className="font-semibold">Move candidate stage</h3>
        <p className="text-sm text-text-muted">Moving stage does not complete an interview or release an offer. Finish screening and submit round feedback before advancing.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Destination stage" required value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="">Choose stage</option>
            {CANDIDATE_STAGES.filter((stage) => stage.value !== "JOINED" && stage.value !== current).map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
          </Select>
          <Input label={needsReason ? "Reason for skipping or returning (required)" : "Reason (optional)"} required={needsReason} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={1000} />
        </div>
        <Button type="submit" disabled={!target || mutation.isPending}>{mutation.isPending ? "Updating…" : "Move stage"}</Button>
      </form>
    )}
    <section aria-label="Stage history" className="space-y-2">
      <h3 className="font-semibold">Stage history</h3>
      {candidate.stageHistory?.length ? <ol className="space-y-2">{candidate.stageHistory.map((event: any) => <li key={event.id} className="rounded-lg bg-tint p-3 text-sm">
        <p>{stageLabel(event.fromStage)} → {stageLabel(event.toStage)}</p>
        {event.reason && <p className="mt-1 whitespace-pre-wrap text-text-muted">{event.reason}</p>}
        <p className="mt-1 text-xs text-text-muted">{new Date(event.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} · Asia/Kolkata</p>
      </li>)}</ol> : <p className="text-sm text-text-muted">No recorded stage moves. Historical transitions have not been inferred.</p>}
    </section>
  </div>;
}

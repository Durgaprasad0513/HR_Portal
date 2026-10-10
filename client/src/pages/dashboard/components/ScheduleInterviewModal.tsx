import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { recruitmentApi } from "@/api/recruitment";
import { employeesApi } from "@/api/employees";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRequisitionId?: string;
  existingCandidate?: any;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  initialRequisitionId,
  existingCandidate,
}: ScheduleInterviewModalProps) {
  const queryClient = useQueryClient();
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [requisitionId, setRequisitionId] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewerId, setInterviewerId] = useState("");
  const [interviewRound, setInterviewRound] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [interviewMode, setInterviewMode] = useState("IN_PERSON");
  React.useEffect(() => {
    if (!isOpen) return;
    setCandidateName(existingCandidate?.candidateName || "");
    setCandidateEmail(existingCandidate?.email || "");
    setRequisitionId(
      existingCandidate?.requisitionId || initialRequisitionId || "",
    );
    setInterviewDate(
      existingCandidate?.interviewDate
        ? new Date(
            new Date(existingCandidate.interviewDate).getTime() + 330 * 60000,
          )
            .toISOString()
            .slice(0, 16)
        : "",
    );
    setInterviewerId(existingCandidate?.interviewerId || "");
    setInterviewRound(existingCandidate?.interviewRound || "");
    setInterviewLocation(existingCandidate?.interviewLocation || "");
    setDurationMinutes(
      existingCandidate?.endsAt && existingCandidate?.interviewDate
        ? String(
            Math.max(
              15,
              Math.round(
                (new Date(existingCandidate.endsAt).getTime() -
                  new Date(existingCandidate.interviewDate).getTime()) /
                  60000,
              ),
            ),
          )
        : "60",
    );
    setInterviewMode(existingCandidate?.mode || "IN_PERSON");
    setRescheduleReason("");
  }, [isOpen, initialRequisitionId, existingCandidate]);

  const { data: empData } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employeesApi.getAll(),
    enabled: isOpen,
  });

  const { data: reqData } = useQuery({
    queryKey: ["requisitions"],
    queryFn: recruitmentApi.getRequisitions,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      existingCandidate
        ? existingCandidate.interviewId
          ? recruitmentApi.rescheduleInterview(
              existingCandidate.interviewId,
              payload.schedule,
            )
          : recruitmentApi.createInterview(
              existingCandidate.id,
              payload.schedule,
            )
        : recruitmentApi.createCandidate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-register"] });
      toast.success(
        existingCandidate?.interviewId
          ? "Interview rescheduled"
          : "Interview scheduled",
      );
      onClose();
      setCandidateName("");
      setCandidateEmail("");
      setRequisitionId("");
      setInterviewDate("");
      setInterviewerId("");
      setInterviewRound("");
      setInterviewLocation("");
      setDurationMinutes("60");
      setInterviewMode("IN_PERSON");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message ||
          "Could not save interview. Please try again.",
      ),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !requisitionId || !interviewDate) return;

    const startsAt = new Date(interviewDate + ":00+05:30");
    mutation.mutate({
      candidateName,
      email: candidateEmail || undefined,
      requisitionId,
      interviewDate: startsAt.toISOString(),
      interviewerId: interviewerId || undefined,
      interviewRound: interviewRound || undefined,
      interviewLocation: interviewLocation || undefined,
      interviewDurationMinutes: Number(durationMinutes),
      interviewMode,
      screeningStatus: "SHORTLISTED", // Auto-shortlist for interview
      schedule: existingCandidate
        ? {
            round: interviewRound || "TELEPHONIC",
            startsAt: startsAt.toISOString(),
            endsAt: new Date(
              startsAt.getTime() + Number(durationMinutes) * 60000,
            ).toISOString(),
            timezone: "Asia/Kolkata",
            mode: interviewMode,
            location: interviewLocation || undefined,
            interviewerId: interviewerId || undefined,
            reason: existingCandidate?.interviewId
              ? rescheduleReason
              : undefined,
          }
        : undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        existingCandidate?.interviewId
          ? "Reschedule Interview"
          : "Schedule Interview"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <Input
          label="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Enter candidate name"
          required
          disabled={!!existingCandidate}
        />
        <Input
          label="Candidate Email"
          type="email"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
          placeholder="Enter candidate email"
          disabled={!!existingCandidate}
        />
        <Select
          label="Position (Requisition)"
          value={requisitionId}
          onChange={(e) => setRequisitionId(e.target.value)}
          required
          disabled={!!existingCandidate}
        >
          <option value="">Select a position...</option>
          {reqData?.data
            ?.filter(
              (r: any) =>
                r.id === existingCandidate?.requisitionId ||
                !["CLOSED", "JOINED_REJECTED"].includes(r.status),
            )
            .map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.positionTitle}
              </option>
            ))}
        </Select>
        <Select
          label="Interviewer"
          value={interviewerId}
          onChange={(e) => setInterviewerId(e.target.value)}
          required
        >
          <option value="">Select an interviewer...</option>
          {(empData as any)?.data
            ?.filter((e: any) => e.isActive)
            .map((emp: any) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Type of Interview"
            value={interviewRound}
            onChange={(e) => setInterviewRound(e.target.value)}
            required
          >
            <option value="">Select interview type...</option>
            <option value="TELEPHONIC">Telephonic</option>
            <option value="HR_INTERVIEW">HR Interview</option>
            <option value="TECHNICAL">Technical Interview</option>
            <option value="MANAGEMENT">Management Interview</option>
          </Select>
          <Input
            label="Place of Interview"
            value={interviewLocation}
            onChange={(e) => setInterviewLocation(e.target.value)}
            placeholder="e.g. Google Meet, Main Office"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Interview mode"
            value={interviewMode}
            onChange={(e) => setInterviewMode(e.target.value)}
          >
            <option value="IN_PERSON">In person</option>
            <option value="VIDEO">Video call</option>
            <option value="PHONE">Phone call</option>
          </Select>
          <Input
            label="Duration (minutes)"
            type="number"
            min="15"
            max="480"
            step="15"
            required
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </div>

        <Input
          label="Interview Date & Time"
          type="datetime-local"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          required
        />
        {existingCandidate?.interviewId && (
          <Input
            label="Reason for rescheduling"
            required
            value={rescheduleReason}
            onChange={(e) => setRescheduleReason(e.target.value)}
          />
        )}
        <p className="-mt-2 text-xs text-slate-500">
          Times are shown in Asia/Kolkata.
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {existingCandidate ? "Save Changes" : "Schedule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

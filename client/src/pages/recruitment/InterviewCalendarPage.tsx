import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruitmentApi } from "@/api/recruitment";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Calendar } from "@/components/ui/Calendar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ScheduleInterviewModal } from "@/pages/dashboard/components/ScheduleInterviewModal";
import { usePermissions } from "@/hooks/usePermissions";
import { interviewCsv } from "./interviewExport";
import toast from "react-hot-toast";
const zone = "Asia/Kolkata";
const dayKey = (date: string | Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
const time = (date: string) =>
  new Date(date).toLocaleTimeString("en-IN", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
  });
const label = (value?: string) =>
  (value || "").replace(/_/g, " ").toLowerCase();
const colors: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  COMPLETED:
    "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  CANCELLED:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  NO_SHOW: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
};
export default function InterviewCalendarPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const reqId = params.get("reqId") || "";
  const { canAdd, canEdit, canExport } = usePermissions();
  const cache = useQueryClient();
  const [view, setView] = useState<"agenda" | "week" | "month">(() => {
    const saved = localStorage.getItem("recruitment-calendar-view");
    return saved === "agenda" || saved === "week" || saved === "month"
      ? saved
      : window.innerWidth < 768
        ? "agenda"
        : "week";
  });
  const [date, setDate] = useState(() =>
    params.get("date")
      ? new Date(params.get("date")! + "T12:00:00+05:30")
      : new Date(),
  );
  const [search, setSearch] = useState(params.get("search") || "");
  const [round, setRound] = useState(params.get("round") || "");
  const [status, setStatus] = useState(params.get("status") || "");
  const [panel, setPanel] = useState(params.get("panel") || "");
  const [schedule, setSchedule] = useState<{ candidate?: any } | null>(null);
  const [decision, setDecision] = useState<{
    interview: any;
    status: string;
  } | null>(null);
  const [reason, setReason] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["interviews", reqId],
    queryFn: () =>
      reqId
        ? recruitmentApi.getCandidates(reqId).then((r) => r.data)
        : recruitmentApi.getInterviews().then((r) => r.data),
  });
  const { data: requisitions } = useQuery({
    queryKey: ["requisitions"],
    queryFn: recruitmentApi.getRequisitions,
  });
  const refresh = () =>
    [
      "interviews",
      "candidates",
      "candidate-register",
      "requisitions",
      "dashboard-stats",
    ].forEach((key) => cache.invalidateQueries({ queryKey: [key] }));
  const appointmentMutation = useMutation({
    mutationFn: ({ id, payload }: any) =>
      recruitmentApi.updateInterviewStatus(id, payload),
    onSuccess: () => {
      refresh();
      setDecision(null);
      setReason("");
      toast.success("Interview updated");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not update interview",
      ),
  });
  const outcomeMutation = useMutation({
    mutationFn: ({ id, selectionStatus }: any) =>
      recruitmentApi.interviewCandidate(id, {
        selectionStatus:
          selectionStatus === "IN_PROGRESS" ? null : selectionStatus,
      }),
    onSuccess: () => {
      refresh();
      toast.success("Candidate outcome updated");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not update candidate",
      ),
  });
  const appointments = useMemo(
    () =>
      (data || [])
        .flatMap((candidate: any) =>
          candidate.interviews?.length
            ? candidate.interviews.map((interview: any) => ({
                ...candidate,
                interviewId: interview.id,
                interviewDate: interview.startsAt,
                startsAt: interview.startsAt,
                endsAt: interview.endsAt,
                interviewRound: interview.round,
                interviewLocation: interview.location,
                mode: interview.mode,
                status: interview.status,
                interviewFeedback: interview.feedback,
                interviewerId: interview.interviewerId,
                interviewer: interview.interviewer,
              }))
            : candidate.interviewDate
              ? [
                  {
                    ...candidate,
                    status:
                      candidate.status ||
                      (candidate.interviewFeedback === "Finished"
                        ? "COMPLETED"
                        : "SCHEDULED"),
                  },
                ]
              : [],
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.interviewDate).getTime() -
            new Date(b.interviewDate).getTime(),
        ),
    [data],
  );
  const interviewers = useMemo(
    () =>
      Array.from(
        new Map(
          appointments
            .filter((a: any) => a.interviewerId)
            .map((a: any) => [a.interviewerId, a.interviewer]),
        ).entries(),
      ) as [string, any][],
    [appointments],
  );
  const filtered = appointments.filter(
    (a: any) =>
      (!search ||
        `${a.candidateName} ${a.email || ""} ${a.requisition?.positionTitle || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (!round || a.interviewRound === round) &&
      (!status || a.status === status) &&
      (!panel || a.interviewerId === panel),
  );
  const start = new Date(dayKey(date) + "T12:00:00+05:30");
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    return day;
  });
  const visible =
    view === "agenda" ? filtered : view === "week"
      ? filtered.filter((a: any) =>
          week.some((day) => dayKey(day) === dayKey(a.interviewDate)),
        )
      : filtered.filter((a: any) => dayKey(a.interviewDate) === dayKey(date));
  React.useEffect(() => {
    const next = new URLSearchParams();
    Object.entries({
      reqId,
      date: view === "agenda" ? "" : dayKey(date),
      search,
      round,
      status,
      panel,
    }).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    if (next.toString() !== params.toString())
      setParams(next, { replace: true });
  }, [reqId, date, view, search, round, status, panel, params, setParams]);
  const changeRange = (direction: number) => {
    const next = new Date(date);
    if (view === "month") next.setMonth(next.getMonth() + direction);
    else next.setDate(next.getDate() + direction * 7);
    setDate(next);
  };
  const card = (a: any) => (
    <article
      key={a.interviewId || a.id}
      className="min-w-0 space-y-3 rounded-xl border border-slate-border bg-surface p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <button
          className="text-left font-semibold text-primary-700 hover:underline dark:text-primary-300"
          onClick={() =>
            navigate(
              `/recruitment?tab=candidates&reqId=${encodeURIComponent(a.requisitionId)}&candidateId=${encodeURIComponent(a.id)}`,
            )
          }
        >
          {a.candidateName}
        </button>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${colors[a.status] || colors.SCHEDULED}`}
        >
          {label(a.status)}
        </span>
      </div>
      <p className="text-sm text-text-muted">
        {a.requisition?.positionTitle || "Opening"} /{" "}
        <span className="capitalize">{label(a.interviewRound)}</span>
      </p>
      <dl className="space-y-1 text-sm">
        <div>
          <dt className="inline text-text-muted">When: </dt>
          <dd className="inline">
            {new Date(a.interviewDate).toLocaleDateString("en-IN", {
              timeZone: zone,
              day: "numeric",
              month: "short",
            })}{" "}
            / {time(a.interviewDate)}
            {a.endsAt ? ` - ${time(a.endsAt)}` : ""}
          </dd>
        </div>
        <div>
          <dt className="inline text-text-muted">Interviewer: </dt>
          <dd className="inline">
            {a.interviewer
              ? `${a.interviewer.firstName} ${a.interviewer.lastName}`
              : "Unassigned"}
          </dd>
        </div>
        <div>
          <dt className="inline text-text-muted">Mode / venue: </dt>
          <dd className="inline break-words">
            {label(a.mode || "IN_PERSON")} /{" "}
            {a.interviewLocation || "Not provided"}
          </dd>
        </div>
      </dl>
      {a.status === "COMPLETED" && (
        <p className="text-sm text-text-muted">
          {a.interviewFeedback ||
            "Awaiting feedback - open candidate details to submit"}
        </p>
      )}
      {canEdit("recruitment") && (
        <>
          <Select
            label="Candidate outcome"
            value={a.selectionStatus || "IN_PROGRESS"}
            disabled={outcomeMutation.isPending}
            onChange={(e) =>
              outcomeMutation.mutate({
                id: a.id,
                selectionStatus: e.target.value,
              })
            }
          >
            <option value="IN_PROGRESS">In progress</option>
            <option value="SELECTION_ON_HOLD">On hold</option>
            <option value="SELECTED">Selected</option>
            <option value="SELECTION_REJECTED">Rejected</option>
          </Select>
          {a.status === "SCHEDULED" && a.interviewId && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSchedule({ candidate: a })}
              >
                Reschedule
              </Button>
              <Button
                size="sm"
                disabled={appointmentMutation.isPending}
                onClick={() =>
                  appointmentMutation.mutate({
                    id: a.interviewId,
                    payload: { status: "COMPLETED" },
                  })
                }
              >
                Complete
              </Button>
              {["CANCELLED", "NO_SHOW"].map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReason("");
                    setDecision({ interview: a, status: value });
                  }}
                >
                  {value === "CANCELLED" ? "Cancel" : "No-show"}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
  return (
    <div className="space-y-5">
      <PageHeader
        title={
          requisitions?.data?.find((r: any) => r.id === reqId)?.positionTitle ||
          "Interview calendar"
        }
        description="Schedule interviews, track appointment status and submit round feedback."
        actions={
          <div className="flex flex-wrap gap-2">
            {reqId && (
              <Button
                variant="outline"
                onClick={() => navigate("/recruitment")}
              >
                All openings
              </Button>
            )}
            {canExport("recruitment") && (
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(
                    new Blob([interviewCsv(visible)], {
                      type: "text/csv;charset=utf-8",
                    }),
                  );
                  link.download = "Interview_Calendar.csv";
                  link.click();
                  URL.revokeObjectURL(link.href);
                }}
              >
                Export CSV
              </Button>
            )}
            {canAdd("recruitment") && (
              <Button onClick={() => setSchedule({})}>
                Schedule interview
              </Button>
            )}
          </div>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-border bg-surface p-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Calendar view"
        >
          {(["agenda", "week", "month"] as const).map((value) => (
            <Button
              key={value}
              variant={view === value ? "primary" : "outline"}
              aria-pressed={view === value}
              onClick={() => {
                setView(value);
                localStorage.setItem("recruitment-calendar-view", value);
              }}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </Button>
          ))}
        </div>
        {view !== "agenda" && <div className="flex items-center gap-2">
          <Button
            variant="outline"
            aria-label="Previous range"
            onClick={() => changeRange(-1)}
          >
            Previous
          </Button>
          <Button variant="outline" onClick={() => setDate(new Date())}>
            Today
          </Button>
          <Button
            variant="outline"
            aria-label="Next range"
            onClick={() => changeRange(1)}
          >
            Next
          </Button>
        </div>}
        <p className="text-sm text-text-muted">
          {view === "agenda" ? "All interview dates" : view !== "month"
            ? `${week[0].toLocaleDateString("en-IN")} - ${week[6].toLocaleDateString("en-IN")}`
            : date.toLocaleDateString("en-IN")}{" "}
          / Asia/Kolkata
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          label="Search"
          placeholder="Candidate or opening"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Opening"
          value={reqId}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            e.target.value
              ? next.set("reqId", e.target.value)
              : next.delete("reqId");
            setParams(next);
          }}
        >
          <option value="">All openings</option>
          {requisitions?.data?.map((r: any) => (
            <option key={r.id} value={r.id}>
              {r.positionTitle}
            </option>
          ))}
        </Select>
        <Select
          label="Round"
          value={round}
          onChange={(e) => setRound(e.target.value)}
        >
          <option value="">All rounds</option>
          {["TELEPHONIC", "HR_INTERVIEW", "TECHNICAL", "MANAGEMENT"].map(
            (r) => (
              <option key={r} value={r}>
                {label(r)}
              </option>
            ),
          )}
        </Select>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((r) => (
            <option key={r} value={r}>
              {label(r)}
            </option>
          ))}
        </Select>
        <Select
          label="Interviewer"
          value={panel}
          onChange={(e) => setPanel(e.target.value)}
        >
          <option value="">All interviewers</option>
          {interviewers.map(([id, person]) => (
            <option key={id} value={id}>
              {person?.firstName} {person?.lastName}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-text-muted">
        <p>
          {visible.length} appointments /{" "}
          {
            appointments.filter(
              (a: any) =>
                a.status === "SCHEDULED" &&
                dayKey(a.interviewDate) === dayKey(new Date()),
            ).length
          }{" "}
          scheduled today /{" "}
          {
            appointments.filter(
              (a: any) => a.status === "COMPLETED" && !a.interviewFeedback,
            ).length
          }{" "}
          awaiting feedback
        </p>
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setRound("");
            setStatus("");
            setPanel("");
          }}
        >
          Clear filters
        </Button>
      </div>
      {isError ? (
        <div role="alert">
          Could not load interviews.{" "}
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <LoadingSpinner />
      ) : view === "week" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 min-[2200px]:grid-cols-7">
          {week.map((day) => (
            <section key={dayKey(day)} className="min-w-0 space-y-3">
              <h2 className="rounded-lg bg-tint p-3 text-sm font-semibold">
                {day.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h2>
              {filtered
                .filter((a: any) => dayKey(a.interviewDate) === dayKey(day))
                .map(card)}
              {!filtered.some(
                (a: any) => dayKey(a.interviewDate) === dayKey(day),
              ) && <p className="p-3 text-sm text-text-muted">No interviews</p>}
            </section>
          ))}
        </div>
      ) : (
        <div
          className={
            view === "month" ? "grid gap-5 md:grid-cols-[20rem_1fr]" : ""
          }
        >
          {view === "month" && <Calendar value={date} onChange={setDate} getDayCount={day => filtered.filter((a: any) => dayKey(a.interviewDate) === dayKey(day)).length} />}
          <div className="grid gap-3 lg:grid-cols-2">
            {visible.map(card)}
            {!visible.length && (
              <p className="rounded-xl border border-dashed border-slate-border p-8 text-text-muted">
                No interviews match these filters.
              </p>
            )}
          </div>
        </div>
      )}
      <ScheduleInterviewModal
        isOpen={!!schedule}
        onClose={() => setSchedule(null)}
        initialRequisitionId={reqId || undefined}
        existingCandidate={schedule?.candidate}
      />
      <Modal
        isOpen={!!decision}
        onClose={() => setDecision(null)}
        title={
          decision?.status === "NO_SHOW"
            ? "Mark interview as no-show"
            : "Cancel interview"
        }
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (decision)
              appointmentMutation.mutate({
                id: decision.interview.interviewId,
                payload: { status: decision.status, reason },
              });
          }}
        >
          <p>
            {decision?.interview.candidateName} / This updates the appointment
            status.
          </p>
          <Input
            label="Reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button
            type="submit"
            disabled={appointmentMutation.isPending || !reason.trim()}
          >
            Save status
          </Button>
        </form>
      </Modal>
    </div>
  );
}

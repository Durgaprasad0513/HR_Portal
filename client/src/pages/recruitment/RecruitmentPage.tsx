import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruitmentApi } from "@/api/recruitment";
import { departmentsApi } from "@/api/departments";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import { ScheduleInterviewModal } from "@/pages/dashboard/components/ScheduleInterviewModal";
import { candidateCsv } from "./interviewExport";

export default function RecruitmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { canExport, canEdit, canAdd, canViewRestricted } = usePermissions();

  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [editingReq, setEditingReq] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "candidates"
      ? "candidates"
      : searchParams.get("tab") === "history"
        ? "history"
        : "openings",
  );
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateStageFilter, setCandidateStageFilter] = useState("");
  const [candidateOutcomeFilter, setCandidateOutcomeFilter] = useState("");
  const [candidatePage, setCandidatePage] = useState(1);
  const [requisitionSearch, setRequisitionSearch] = useState("");
  const [closureRequest, setClosureRequest] = useState<any>(null);
  const [closureReason, setClosureReason] = useState("");
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState<any>(null);
  const [screeningNotes, setScreeningNotes] = useState("");

  const { data: deptData } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getAll,
  });

  const { data: reqResponse, isLoading } = useQuery({
    queryKey: ["requisitions"],
    queryFn: recruitmentApi.getRequisitions,
  });
  const { data: candidatesResponse, isLoading: isCandidatesLoading } = useQuery(
    {
      queryKey: ["candidates", selectedReq?.id],
      queryFn: () => recruitmentApi.getCandidates(selectedReq!.id),
      enabled: !!selectedReq,
    },
  );
  const {
    data: registerResponse,
    isLoading: isRegisterLoading,
    isError: isRegisterError,
  } = useQuery({
    queryKey: [
      "candidate-register",
      candidateSearch,
      candidateStageFilter,
      candidateOutcomeFilter,
      candidatePage,
    ],
    queryFn: () =>
      recruitmentApi.getCandidateRegister({
        search: candidateSearch,
        stage: candidateStageFilter,
        outcome: candidateOutcomeFilter,
        page: candidatePage,
        pageSize: 25,
      }),
    enabled: !selectedReq && activeTab === "candidates",
  });
  const candidatesData = candidatesResponse?.data || [];
  const candidateRegister = registerResponse?.data?.items || [];

  const data = reqResponse?.data || [];
  const historyRequisitions = data.filter((req: any) =>
    ["CLOSED", "JOINED_REJECTED"].includes(req.status),
  );
  const activeRequisitions = data.filter(
    (req: any) => !["CLOSED", "JOINED_REJECTED"].includes(req.status),
  );
  const visibleRequisitions = data
    .filter((req: any) =>
      activeTab === "history" || showHistory
        ? ["CLOSED", "JOINED_REJECTED"].includes(req.status)
        : !["CLOSED", "JOINED_REJECTED"].includes(req.status),
    )
    .filter(
      (req: any) =>
        !requisitionSearch ||
        `${req.positionTitle} ${req.location || ""} ${req.department?.name || ""}`
          .toLowerCase()
          .includes(requisitionSearch.toLowerCase()),
    );
  const routeReqId = searchParams.get("reqId");
  const routeCandidateId = searchParams.get("candidateId");
  const routeCandidate = candidatesData.find(
    (candidate: any) => candidate.id === routeCandidateId,
  );
  React.useEffect(() => {
    setScreeningNotes(routeCandidate?.screeningNotes || "");
  }, [routeCandidate?.id, routeCandidate?.screeningNotes]);
  const candidateStages = [
    { value: "SCREENING", label: "Screening" },
    { value: "TELEPHONIC", label: "Telephonic" },
    { value: "HR_INTERVIEW", label: "HR interview" },
    { value: "TECHNICAL", label: "Technical Interview" },
    { value: "MANAGEMENT", label: "Management interview" },
    { value: "OFFER", label: "Offer" },
  ];
  const currentCandidateStage = routeCandidate
    ? routeCandidate.offerStatus &&
      routeCandidate.offerStatus !== "NOT_RELEASED"
      ? "OFFER"
      : routeCandidate.screeningStatus === "SCREENING_PENDING" ||
          routeCandidate.screeningStatus === "SCREENING_REJECTED"
        ? "SCREENING"
        : routeCandidate.interviews?.find(
            (interview: any) => interview.status === "SCHEDULED",
          )?.round || "TELEPHONIC"
    : "";
  const candidateStageIndex = routeCandidate
    ? Math.max(
        0,
        candidateStages.findIndex(
          (stage) => stage.value === currentCandidateStage,
        ),
      )
    : -1;

  React.useEffect(() => {
    if (!routeReqId) {
      setSelectedReq(null);
      return;
    }
    if (!data.length) return;
    const requisition = data.find((req: any) => req.id === routeReqId);
    if (requisition) setSelectedReq(requisition);
  }, [routeReqId, data]);

  React.useEffect(() => {
    if (routeReqId && !routeCandidateId) {
      navigate(
        `/recruitment/interviews?reqId=${encodeURIComponent(routeReqId)}`,
        { replace: true },
      );
    }
  }, [routeReqId, routeCandidateId, navigate]);

  React.useEffect(() => {
    if (searchParams.get("tab") === "vacancies") {
      setSelectedReq(null);
    }
  }, [searchParams]);

  const createReqMutation = useMutation({
    mutationFn: (payload: any) => recruitmentApi.createRequisition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setIsReqModalOpen(false);
      setEditingReq(null);
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not create requisition",
      ),
  });

  const screenMutation = useMutation({
    mutationFn: ({
      id,
      screeningStatus,
      notes,
    }: {
      id: string;
      screeningStatus: string;
      notes?: string;
    }) =>
      recruitmentApi.screenCandidate(id, {
        screeningStatus,
        screeningNotes: notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-register"] });
      toast.success("Screening updated");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not update screening",
      ),
  });
  const offerMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      recruitmentApi.offerCandidate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-register"] });
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Offer status updated");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Could not update offer"),
  });
  const feedbackMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      recruitmentApi.submitInterviewFeedback(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-register"] });
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      toast.success("Interview feedback saved");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not save interview feedback",
      ),
  });

  const closureMutation = useMutation({
    mutationFn: ({ id, status, reason }: any) =>
      recruitmentApi.updateRequisitionStatus(id, { status, reason }),
    onSuccess: () => {
      setClosureRequest(null);
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Opening status updated");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Could not update opening"),
  });
  const applicationMutation = useMutation({
    mutationFn: (payload: any) => recruitmentApi.createCandidate(payload),
    onSuccess: (response: any) => {
      setApplicationOpen(false);
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-register"] });
      navigate(
        `/recruitment?tab=candidates&reqId=${response.data.requisitionId}&candidateId=${response.data.id}`,
      );
      toast.success("Application saved");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not save application",
      ),
  });
  const decisionMutation = useMutation({
    mutationFn: (payload: any) =>
      recruitmentApi.interviewCandidate(routeCandidate.id, payload),
    onSuccess: () => {
      [
        "requisitions",
        "candidate-register",
        "candidates",
        "interviews",
        "dashboard-stats",
      ].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success("Candidate decision saved");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not save candidate decision",
      ),
  });
  const handleScreeningSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (!routeCandidate) return;
    screenMutation.mutate({
      id: routeCandidate.id,
      screeningStatus: String(values.get("screeningStatus")),
      notes: screeningNotes,
    });
  };
  const handleOfferSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (!routeCandidate) return;
    const salaryText = String(values.get("offeredSalary") || "");
    offerMutation.mutate({
      id: routeCandidate.id,
      payload: {
        offerStatus: String(values.get("offerStatus")),
        offerDate: values.get("offerDate")
          ? new Date(String(values.get("offerDate"))).toISOString()
          : undefined,
        joiningDate: values.get("joiningDate")
          ? new Date(String(values.get("joiningDate"))).toISOString()
          : undefined,
        offeredSalary: salaryText ? Number(salaryText) : undefined,
        joiningStatus: String(values.get("joiningStatus") || "PENDING"),
        actualJoiningDate: values.get("actualJoiningDate")
          ? new Date(String(values.get("actualJoiningDate"))).toISOString()
          : undefined,
      },
    });
  };
  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const score = String(values.get("score") || "");
    feedbackMutation.mutate({
      id: String(values.get("interviewId")),
      payload: {
        feedback: String(values.get("feedback")),
        draft:
          (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
            "value",
          ) === "draft",
        revisionReason: values.get("revisionReason") || undefined,
        score: score ? Number(score) : undefined,
        recommendation: values.get("recommendation") || undefined,
      },
    });
  };

  const updateReqMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      recruitmentApi.updateRequisition(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setIsReqModalOpen(false);
      setEditingReq(null);
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Could not update requisition",
      ),
  });

  const handleExportCandidates = () => {
    if (!candidatesData?.length) return;
    const encodedUri =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(candidateCsv(candidatesData));
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Candidates_${selectedReq?.positionTitle?.replace(/\s+/g, "_") || "Pipeline"}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      positionTitle: formData.get("positionTitle"),
      departmentId: formData.get("departmentId"),
      location: formData.get("location"),
      numberOfVacancies: Number(formData.get("numberOfVacancies")),
    };

    if (editingReq) {
      updateReqMutation.mutate({ id: editingReq.id, payload });
    } else {
      createReqMutation.mutate({
        ...payload,
        requisitionDate: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full h-[calc(100vh-6rem)]">
      <PageHeader
        title="Recruitment Tracker"
        description="Manage job openings and scheduled interviews."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {canAdd("recruitment") && (
              <Button
                variant="outline"
                onClick={() => setApplicationOpen(true)}
              >
                New application
              </Button>
            )}
            {canAdd("recruitment") && (
              <Button
                onClick={() => {
                  setEditingReq(null);
                  setIsReqModalOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> New Requisition
              </Button>
            )}
          </div>
        }
      />

      <div className="animate-in fade-in flex-1 min-h-0 h-full">
        {selectedReq ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() =>
                    navigate(
                      `/recruitment?tab=${activeTab === "candidates" ? "candidates" : "openings"}`,
                    )
                  }
                  className="px-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                    {selectedReq.positionTitle}
                  </h2>
                  {selectedReq.closureSource && (
                    <p className="text-sm text-gray-500">
                      Closed{" "}
                      {selectedReq.closureSource === "AUTO_FILLED"
                        ? "automatically"
                        : "manually"}
                      : {selectedReq.closureReason || "No reason recorded"}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {routeCandidate
                      ? "Candidate stage tracker"
                      : "HR Funnel Layout Structure"}
                  </p>
                </div>
              </div>
              {canExport("recruitment") && (
                <Button variant="outline" onClick={handleExportCandidates}>
                  <Download className="w-4 h-4 mr-2" /> Export Register
                </Button>
              )}
            </div>
            {routeCandidateId ? (
              isCandidatesLoading ? (
                <div className="py-12">
                  <LoadingSpinner />
                </div>
              ) : routeCandidate ? (
                <section
                  className="space-y-5 rounded-xl border border-slate-border bg-surface p-5 shadow-sm"
                  aria-label={`${routeCandidate.candidateName} recruitment stages`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                        {routeCandidate.candidateName}
                      </h3>
                      {canAdd("recruitment") &&
                        !["SELECTED", "SELECTION_REJECTED"].includes(
                          routeCandidate.selectionStatus,
                        ) &&
                        routeCandidate.screeningStatus !==
                          "SCREENING_REJECTED" &&
                        routeCandidate.joiningStatus !== "JOINED" && (
                          <Button
                            className="mt-3"
                            onClick={() =>
                              setScheduleCandidate({
                                ...routeCandidate,
                                interviewId: undefined,
                                interviewDate: undefined,
                                interviewRound: "",
                              })
                            }
                          >
                            Schedule next round
                          </Button>
                        )}
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {routeCandidate.email || "No email provided"}
                        {routeCandidate.interviewDate
                          ? ` · Interview ${new Date(routeCandidate.interviewDate).toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                    <dl className="grid min-w-full grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-border pt-3 text-sm text-gray-600 dark:text-gray-300 sm:min-w-0 sm:grid-cols-3 sm:border-0 sm:pt-0">
                      <div>
                        <dt className="text-xs text-gray-500">Phone</dt>
                        <dd>{routeCandidate.mobile || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Qualification</dt>
                        <dd>
                          {routeCandidate.qualification || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Experience</dt>
                        <dd>
                          {routeCandidate.totalExperience != null
                            ? `${routeCandidate.totalExperience} years`
                            : "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">
                          Current company
                        </dt>
                        <dd>
                          {routeCandidate.currentCompany || "Not provided"}
                        </dd>
                      </div>
                      {canViewRestricted("recruitment") && (
                        <>
                          <div>
                            <dt className="text-xs text-gray-500">
                              Expected salary
                            </dt>
                            <dd>
                              {routeCandidate.expectedSalary != null
                                ? `₹${Number(routeCandidate.expectedSalary).toLocaleString("en-IN")}`
                                : "Not provided"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">
                              Current salary
                            </dt>
                            <dd>
                              {routeCandidate.currentSalary != null
                                ? `₹${Number(routeCandidate.currentSalary).toLocaleString("en-IN")}`
                                : "Not provided"}
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>
                  <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                    {candidateStages.map((stage, index) => {
                      const complete =
                        stage.value === "SCREENING"
                          ? routeCandidate.screeningStatus === "SHORTLISTED"
                          : stage.value === "OFFER"
                            ? ["OFFER_ACCEPTED", "OFFER_DECLINED"].includes(
                                routeCandidate.offerStatus,
                              )
                            : (routeCandidate.interviews || []).some(
                                (interview: any) =>
                                  interview.round === stage.value &&
                                  interview.status === "COMPLETED",
                              );
                      const current =
                        index === candidateStageIndex && !complete;
                      return (
                        <li
                          key={stage.value}
                          className={`rounded-xl border p-4 ${current ? "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30" : complete ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" : "border-slate-border bg-surface"}`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${current ? "bg-orange-500 text-white" : complete ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
                            >
                              {complete ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </span>
                            <span className="font-semibold text-navy-900 dark:text-white">
                              {stage.label}
                            </span>
                          </div>
                          <p className="mt-2 pl-9 text-xs text-gray-500 dark:text-gray-400">
                            {current
                              ? "Current stage"
                              : complete
                                ? "Completed"
                                : "Upcoming"}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-border p-4">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Screening
                      </p>
                      <p className="mt-1 font-semibold">
                        {routeCandidate.screeningStatus?.replaceAll("_", " ") ||
                          "SCREENING PENDING"}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-500">
                        {routeCandidate.screeningNotes || "No screening notes"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-border p-4">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Candidate outcome
                      </p>
                      <p className="mt-1 font-semibold">
                        {routeCandidate.selectionStatus?.replaceAll("_", " ") ||
                          "In progress"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-border p-4">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Offer
                      </p>
                      <p className="mt-1 font-semibold">
                        {routeCandidate.offerStatus?.replaceAll("_", " ") ||
                          "Not released"}
                      </p>
                      {routeCandidate.offerDate && (
                        <p className="mt-1 text-sm text-gray-500">
                          Offered{" "}
                          {new Date(
                            routeCandidate.offerDate,
                          ).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Joining outcome:{" "}
                        {(routeCandidate.joiningStatus || "PENDING").replace(
                          /_/g,
                          " ",
                        )}
                        {routeCandidate.actualJoiningDate
                          ? ` / ${new Date(routeCandidate.actualJoiningDate).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}`
                          : ""}
                      </p>
                      {routeCandidate.joiningDate && (
                        <p className="text-sm text-gray-500">
                          Joining{" "}
                          {new Date(
                            routeCandidate.joiningDate,
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {canViewRestricted("recruitment") &&
                        routeCandidate.offeredSalary != null && (
                          <p className="text-sm text-gray-500">
                            ₹
                            {Number(
                              routeCandidate.offeredSalary,
                            ).toLocaleString("en-IN")}
                          </p>
                        )}
                    </div>
                  </div>

                  <section className="space-y-3" aria-label="Interview history">
                    <h4 className="font-semibold">Interview history</h4>
                    {(routeCandidate.interviews || []).length ? (
                      routeCandidate.interviews.map((interview: any) => (
                        <article
                          key={interview.id}
                          className="rounded-lg border border-slate-border p-3"
                        >
                          <div className="flex flex-wrap justify-between gap-2">
                            <span className="font-medium">
                              {interview.round.replaceAll("_", " ")}
                            </span>
                            <span className="text-sm">
                              {interview.status.replaceAll("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(interview.startsAt).toLocaleString(
                              "en-IN",
                              {
                                timeZone: interview.timezone || "Asia/Kolkata",
                              },
                            )}{" "}
                            · {interview.timezone || "Asia/Kolkata"} ·{" "}
                            {interview.mode.replaceAll("_", " ")}
                            {interview.location
                              ? ` · ${interview.location}`
                              : ""}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {interview.feedback || "Feedback pending"}
                            {interview.score != null
                              ? ` · Score ${interview.score}/10`
                              : ""}
                            {interview.recommendation
                              ? ` · ${interview.recommendation.replaceAll("_", " ")}`
                              : ""}
                          </p>
                          {interview.draftFeedback && (
                            <p className="text-xs text-text-muted">
                              Draft saved. Submit it to finalize this
                              evaluation.
                            </p>
                          )}
                          {interview.feedbackSubmittedAt && (
                            <p className="text-xs text-text-muted">
                              Submitted{" "}
                              {new Date(
                                interview.feedbackSubmittedAt,
                              ).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })}
                            </p>
                          )}
                          {canEdit("recruitment") &&
                            interview.status === "COMPLETED" && (
                              <form
                                className="mt-3 grid gap-2 sm:grid-cols-[1fr_9rem_10rem_auto]"
                                onSubmit={handleFeedbackSubmit}
                              >
                                <input
                                  type="hidden"
                                  name="interviewId"
                                  value={interview.id}
                                />
                                <Input
                                  name="feedback"
                                  label="Interview feedback"
                                  required
                                  defaultValue={
                                    interview.draftFeedback ??
                                    interview.feedback ??
                                    ""
                                  }
                                  placeholder="Record evidence-based feedback"
                                />
                                <Input
                                  name="score"
                                  label="Score (optional, 1–10)"
                                  type="number"
                                  min="1"
                                  max="10"
                                  defaultValue={
                                    interview.draftScore ??
                                    interview.score ??
                                    ""
                                  }
                                />
                                <Select
                                  name="recommendation"
                                  label="Recommendation"
                                  defaultValue={
                                    interview.draftRecommendation ??
                                    interview.recommendation ??
                                    ""
                                  }
                                >
                                  <option value="">Not provided</option>
                                  <option value="STRONG_YES">Strong yes</option>
                                  <option value="YES">Yes</option>
                                  <option value="HOLD">Hold</option>
                                  <option value="NO">No</option>
                                </Select>
                                {interview.feedback && (
                                  <Input
                                    name="revisionReason"
                                    label="Reason for feedback correction"
                                    placeholder="Required when resubmitting"
                                  />
                                )}
                                <div className="self-end flex flex-wrap gap-2">
                                  <Button
                                    type="submit"
                                    name="intent"
                                    value="draft"
                                    variant="outline"
                                    disabled={feedbackMutation.isPending}
                                  >
                                    Save draft
                                  </Button>
                                  <Button
                                    type="submit"
                                    name="intent"
                                    value="submit"
                                    disabled={feedbackMutation.isPending}
                                  >
                                    {feedbackMutation.isPending
                                      ? "Saving…"
                                      : "Submit feedback"}
                                  </Button>
                                </div>
                              </form>
                            )}
                        </article>
                      ))
                    ) : routeCandidate.interviewDate ? (
                      <p className="text-sm text-gray-500">
                        Legacy interview scheduled for{" "}
                        {new Date(
                          routeCandidate.interviewDate,
                        ).toLocaleString()}
                        .
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No interviews scheduled.
                      </p>
                    )}
                  </section>

                  <section
                    aria-label="Candidate activity"
                    className="space-y-2"
                  >
                    <h4 className="font-semibold">Activity</h4>
                    {routeCandidate.activity?.length ? (
                      <ol className="max-h-60 space-y-2 overflow-y-auto">
                        {routeCandidate.activity.map((event: any) => (
                          <li
                            key={event.id}
                            className="rounded-lg bg-tint p-3 text-sm"
                          >
                            <span className="capitalize">
                              {event.actionPerformed
                                .replace(/_/g, " ")
                                .toLowerCase()}
                            </span>
                            <p className="text-xs text-text-muted">
                              {event.user?.email || "System"} /{" "}
                              {new Date(event.createdAt).toLocaleString(
                                "en-IN",
                                { timeZone: "Asia/Kolkata" },
                              )}
                            </p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-text-muted">
                        No activity recorded.
                      </p>
                    )}
                  </section>
                  {canEdit("recruitment") && (
                    <form
                      className="grid gap-3 rounded-xl border border-slate-border p-4 sm:grid-cols-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const values = new FormData(e.currentTarget);
                        decisionMutation.mutate({
                          selectionStatus:
                            values.get("selectionStatus") === "IN_PROGRESS"
                              ? null
                              : values.get("selectionStatus"),
                        });
                      }}
                    >
                      <Select
                        name="selectionStatus"
                        label="Candidate decision"
                        defaultValue={
                          routeCandidate.selectionStatus || "IN_PROGRESS"
                        }
                      >
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="SELECTION_ON_HOLD">On hold</option>
                        <option value="SELECTED">Selected</option>
                        <option value="SELECTION_REJECTED">Rejected</option>
                      </Select>
                      <div className="self-end">
                        <Button
                          type="submit"
                          disabled={decisionMutation.isPending}
                        >
                          Save decision
                        </Button>
                      </div>
                    </form>
                  )}
                  {canEdit("recruitment") && (
                    <div className="grid gap-5 lg:grid-cols-2">
                      <form
                        onSubmit={handleScreeningSubmit}
                        className="space-y-3 rounded-xl border border-slate-border p-4"
                      >
                        <h4 className="font-semibold">Screening decision</h4>
                        <Select
                          name="screeningStatus"
                          label="Screening status"
                          defaultValue={
                            routeCandidate.screeningStatus ||
                            "SCREENING_PENDING"
                          }
                        >
                          <option value="SCREENING_PENDING">Pending</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="SCREENING_REJECTED">Rejected</option>
                        </Select>
                        <label
                          className="block text-sm font-medium"
                          htmlFor="screening-notes"
                        >
                          Screening notes
                        </label>
                        <textarea
                          id="screening-notes"
                          className="min-h-24 w-full rounded-lg border border-slate-border bg-surface p-3 text-sm"
                          value={screeningNotes}
                          onChange={(e) => setScreeningNotes(e.target.value)}
                          placeholder="Record relevant screening notes"
                        />
                        <Button
                          type="submit"
                          disabled={screenMutation.isPending}
                        >
                          {screenMutation.isPending
                            ? "Saving…"
                            : "Save screening"}
                        </Button>
                      </form>
                      <form
                        onSubmit={handleOfferSubmit}
                        className="space-y-3 rounded-xl border border-slate-border p-4"
                      >
                        <h4 className="font-semibold">Offer management</h4>
                        <Select
                          name="offerStatus"
                          label="Offer status"
                          defaultValue={
                            routeCandidate.offerStatus || "NOT_RELEASED"
                          }
                        >
                          <option value="NOT_RELEASED">Not released</option>
                          <option value="RELEASED">Released</option>
                          <option value="OFFER_ACCEPTED">Accepted</option>
                          <option value="OFFER_DECLINED">Declined</option>
                        </Select>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {canViewRestricted("recruitment") && (
                            <Input
                              name="offeredSalary"
                              label="Offer salary (₹)"
                              type="number"
                              min="0"
                              defaultValue={routeCandidate.offeredSalary ?? ""}
                            />
                          )}
                          <Input
                            name="offerDate"
                            label="Offer date"
                            type="date"
                            defaultValue={
                              routeCandidate.offerDate?.slice(0, 10) || ""
                            }
                          />
                          <Input
                            name="joiningDate"
                            label="Expected joining date"
                            type="date"
                            defaultValue={
                              routeCandidate.joiningDate?.slice(0, 10) || ""
                            }
                          />
                        </div>
                        <Select
                          name="joiningStatus"
                          label="Joining outcome"
                          defaultValue={
                            routeCandidate.joiningStatus || "PENDING"
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="JOINED">Joined</option>
                          <option value="NOT_JOINED">Did not join</option>
                        </Select>
                        <Input
                          name="actualJoiningDate"
                          label="Actual joining date"
                          type="date"
                          defaultValue={
                            routeCandidate.actualJoiningDate?.slice(0, 10) || ""
                          }
                        />
                        <Button
                          type="submit"
                          disabled={offerMutation.isPending}
                        >
                          {offerMutation.isPending
                            ? "Saving…"
                            : "Save offer status"}
                        </Button>
                      </form>
                    </div>
                  )}
                </section>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-border p-8 text-center text-gray-500">
                  Candidate not found for this requisition.
                </div>
              )
            ) : (
              <div className="py-12">
                <LoadingSpinner />
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <nav
              className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
              role="tablist"
              aria-label="Recruitment workspace"
            >
              {(["openings", "candidates", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowHistory(tab === "history");
                    navigate(`/recruitment?tab=${tab}`);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${activeTab === tab ? "bg-white text-primary-700 shadow-sm dark:bg-slate-700 dark:text-primary-300" : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"}`}
                >
                  {tab === "openings"
                    ? `Openings (${activeRequisitions.length})`
                    : tab === "history"
                      ? `History (${historyRequisitions.length})`
                      : "Candidates"}
                </button>
              ))}
            </nav>
            {activeTab === "candidates" ? (
              <section aria-label="Candidate register" className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[minmax(14rem,1fr)_12rem_12rem]">
                  <Input
                    aria-label="Search candidates"
                    placeholder="Search name or email…"
                    value={candidateSearch}
                    onChange={(e) => {
                      setCandidateSearch(e.target.value);
                      setCandidatePage(1);
                    }}
                  />
                  <Select
                    aria-label="Filter by interview stage"
                    value={candidateStageFilter}
                    onChange={(e) => {
                      setCandidateStageFilter(e.target.value);
                      setCandidatePage(1);
                    }}
                  >
                    <option value="">All stages</option>
                    <option value="SCREENING">Screening</option>
                    <option value="TELEPHONIC">Telephonic</option>
                    <option value="HR_INTERVIEW">HR interview</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="MANAGEMENT">Management</option>
                    <option value="OFFER">Offer</option>
                  </Select>
                  <Select
                    aria-label="Filter by candidate outcome"
                    value={candidateOutcomeFilter}
                    onChange={(e) => {
                      setCandidateOutcomeFilter(e.target.value);
                      setCandidatePage(1);
                    }}
                  >
                    <option value="">All outcomes</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="SELECTED">Selected</option>
                    <option value="SELECTION_ON_HOLD">On hold</option>
                    <option value="SELECTION_REJECTED">Rejected</option>
                  </Select>
                </div>
                {isRegisterError ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 p-4 text-sm text-red-700"
                  >
                    Could not load candidates. Refresh the page to retry.
                  </div>
                ) : null}
                {isRegisterLoading ? (
                  <div className="py-10">
                    <LoadingSpinner />
                  </div>
                ) : candidateRegister.length ? (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {candidateRegister.map((candidate: any) => {
                      const next = candidate.interviews?.[0];
                      const round =
                        candidate.interviewRound ||
                        (candidate.screeningStatus === "SHORTLISTED"
                          ? "TELEPHONIC"
                          : "SCREENING");
                      return (
                        <article
                          key={candidate.id}
                          className="rounded-xl border border-slate-border bg-surface p-4 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <button
                                type="button"
                                className="font-semibold text-primary-700 hover:underline dark:text-primary-300"
                                onClick={() =>
                                  navigate(
                                    `/recruitment?tab=candidates&reqId=${encodeURIComponent(candidate.requisitionId)}&candidateId=${encodeURIComponent(candidate.id)}`,
                                  )
                                }
                              >
                                {candidate.candidateName}
                              </button>
                              <p className="truncate text-sm text-gray-500">
                                {candidate.requisition?.positionTitle ||
                                  "Opening"}{" "}
                                · {candidate.email || "No email"}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold dark:bg-slate-800">
                              {round.replaceAll("_", " ")}
                            </span>
                          </div>
                          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <dt className="text-xs text-gray-500">Outcome</dt>
                              <dd className="font-medium">
                                {candidate.selectionStatus?.replaceAll(
                                  "_",
                                  " ",
                                ) || "In progress"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-gray-500">
                                Screening
                              </dt>
                              <dd className="font-medium">
                                {candidate.screeningStatus?.replaceAll(
                                  "_",
                                  " ",
                                )}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-gray-500">
                                Next interview
                              </dt>
                              <dd className="font-medium">
                                {next
                                  ? new Date(next.startsAt).toLocaleString(
                                      "en-IN",
                                      { timeZone: "Asia/Kolkata" },
                                    )
                                  : "Not scheduled"}
                              </dd>
                            </div>
                          </dl>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-border p-8 text-center text-sm text-gray-500">
                    No candidates match these filters.
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-border pt-3 text-sm text-gray-500">
                  <span>
                    {registerResponse?.data?.total || 0} candidates · Page{" "}
                    {candidatePage} of{" "}
                    {Math.max(
                      1,
                      Math.ceil((registerResponse?.data?.total || 0) / 25),
                    )}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={candidatePage <= 1}
                      onClick={() => setCandidatePage((page) => page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        candidatePage >=
                        Math.ceil((registerResponse?.data?.total || 0) / 25)
                      }
                      onClick={() => setCandidatePage((page) => page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </section>
            ) : (
              <section aria-label="Job requisitions" className="space-y-3">
                {activeTab === "openings" && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <article className="rounded-xl border border-slate-border bg-surface p-4">
                      <p className="text-sm text-gray-500">Active openings</p>
                      <p className="mt-1 text-2xl font-bold">
                        {activeRequisitions.length}
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-border bg-surface p-4">
                      <p className="text-sm text-gray-500">
                        Remaining vacancies
                      </p>
                      <p className="mt-1 text-2xl font-bold">
                        {activeRequisitions.reduce(
                          (sum: number, req: any) =>
                            sum + (req.remainingCount ?? req.numberOfVacancies),
                          0,
                        )}
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-border bg-surface p-4">
                      <p className="text-sm text-gray-500">
                        Candidates in active openings
                      </p>
                      <p className="mt-1 text-2xl font-bold">
                        {activeRequisitions.reduce(
                          (sum: number, req: any) =>
                            sum + (req._count?.candidates || 0),
                          0,
                        )}
                      </p>
                    </article>
                  </div>
                )}
                <Input
                  aria-label="Search openings"
                  placeholder="Search opening, location or department…"
                  value={requisitionSearch}
                  onChange={(e) => setRequisitionSearch(e.target.value)}
                />
                <p className="border-b border-slate-border px-4 py-2 text-xs text-gray-500 dark:border-slate-border dark:text-gray-400 sm:hidden">
                  Tap an opening to view its scheduled interviews.
                </p>
                {visibleRequisitions.length === 0 ? (
                  <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-border bg-surface px-6 text-center text-gray-600 dark:text-gray-400">
                    {activeTab === "history"
                      ? "No closed vacancies in history."
                      : "No open vacancies found."}
                  </div>
                ) : (
                  visibleRequisitions.map((req: any) => (
                    <article
                      key={req.id}
                      className="group flex flex-col gap-4 rounded-xl border border-slate-border bg-surface p-4 shadow-sm transition duration-200 hover:border-slate-border hover:shadow-md dark:hover:border-slate-600 md:grid md:grid-cols-[minmax(0,1fr)_15rem_auto] md:items-center md:gap-6 md:p-5"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <Briefcase className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 text-base font-semibold leading-6 text-navy-900 dark:text-white">
                            <button
                              type="button"
                              className="text-left hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                              onClick={() =>
                                navigate(
                                  `/recruitment/interviews?reqId=${encodeURIComponent(req.id)}`,
                                )
                              }
                              aria-label={`View scheduled interviews for ${req.positionTitle}`}
                            >
                              {req.positionTitle}
                            </button>
                          </h2>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {req.location}
                          </p>
                          <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {req.department?.name || "Department not specified"}
                          </p>
                        </div>
                      </div>

                      <dl className="grid grid-cols-2 gap-4 border-t border-slate-border pt-4 dark:border-slate-border md:border-l md:border-t-0 md:py-1 md:pl-6">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Candidates
                          </dt>
                          <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            <Users className="h-4 w-4" aria-hidden="true" />
                            {req._count?.candidates || 0}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Filled / remaining
                          </dt>
                          <dd className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {req.filledCount ?? req.selectedCount ?? 0} /{" "}
                            {req.remainingCount ?? req.numberOfVacancies}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex items-center justify-between gap-3 border-t border-slate-border pt-4 dark:border-slate-border md:justify-end md:border-l md:border-t-0 md:py-1 md:pl-6">
                        {canEdit("recruitment") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setClosureReason("");
                              setClosureRequest({
                                id: req.id,
                                status: ["CLOSED", "JOINED_REJECTED"].includes(
                                  req.status,
                                )
                                  ? "REQUIREMENT"
                                  : "CLOSED",
                              });
                            }}
                          >
                            {["CLOSED", "JOINED_REJECTED"].includes(req.status)
                              ? "Reopen"
                              : "Close"}
                          </Button>
                        )}
                        {canEdit("recruitment") && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingReq(req);
                              setIsReqModalOpen(true);
                            }}
                            onKeyDown={(event) => event.stopPropagation()}
                            aria-label={`Edit ${req.positionTitle} requisition`}
                          >
                            <Pencil
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />{" "}
                            Edit
                          </Button>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
                          View interviews{" "}
                          <ChevronRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </section>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isReqModalOpen}
        onClose={() => {
          setIsReqModalOpen(false);
          setEditingReq(null);
        }}
        title={editingReq ? "Edit Job Requisition" : "New Job Requisition"}
      >
        <form onSubmit={handleSubmitReq} className="space-y-4">
          <Input
            name="positionTitle"
            label="Job Title"
            placeholder="e.g. Senior Frontend Engineer"
            required
            defaultValue={editingReq?.positionTitle}
          />
          <div className="flex flex-col">
            <label
              htmlFor="requisition-department"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1  text-gray-700 dark:text-gray-300 mb-1"
            >
              Department
            </label>
            <Select
              id="requisition-department"
              name="departmentId"
              required
              defaultValue={editingReq?.departmentId}
              className="w-full rounded-[1.25rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface px-4 py-3 text-[13px] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] bg-surface text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
            >
              <option value="">Select Department...</option>
              {deptData?.data?.map((dept: any) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="location"
              label="Location"
              placeholder="e.g. Remote"
              required
              defaultValue={editingReq?.location}
            />
            <Input
              name="numberOfVacancies"
              label="Vacancies"
              type="number"
              min="1"
              required
              defaultValue={editingReq?.numberOfVacancies}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsReqModalOpen(false);
                setEditingReq(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createReqMutation.isPending || updateReqMutation.isPending
              }
            >
              {createReqMutation.isPending || updateReqMutation.isPending
                ? "Submitting..."
                : editingReq
                  ? "Update Requisition"
                  : "Create Requisition"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!closureRequest}
        onClose={() => setClosureRequest(null)}
        title={
          closureRequest?.status === "CLOSED"
            ? "Close opening"
            : "Reopen opening"
        }
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            closureMutation.mutate({
              ...closureRequest,
              reason: closureReason,
            });
          }}
        >
          <Input
            label="Reason"
            required
            value={closureReason}
            onChange={(e) => setClosureReason(e.target.value)}
          />
          <Button
            type="submit"
            disabled={closureMutation.isPending || !closureReason.trim()}
          >
            Save opening status
          </Button>
        </form>
      </Modal>
      <Modal
        isOpen={applicationOpen && canAdd("recruitment")}
        onClose={() => setApplicationOpen(false)}
        title="New application"
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const values = new FormData(e.currentTarget);
            applicationMutation.mutate({
              candidateName: values.get("candidateName"),
              requisitionId: values.get("requisitionId"),
              email: values.get("email") || undefined,
              mobile: values.get("mobile") || undefined,
              qualification: values.get("qualification") || undefined,
              source: values.get("source") || undefined,
            });
          }}
        >
          <Select name="requisitionId" label="Opening" required>
            <option value="">Choose an opening</option>
            {activeRequisitions.map((req: any) => (
              <option key={req.id} value={req.id}>
                {req.positionTitle}
              </option>
            ))}
          </Select>
          <Input name="candidateName" label="Candidate name" required />
          <Input name="email" label="Email" type="email" />
          <Input name="mobile" label="Phone" />
          <Input name="qualification" label="Qualification" />
          <Input name="source" label="Application source" />
          <Button type="submit" disabled={applicationMutation.isPending}>
            Save application
          </Button>
        </form>
      </Modal>
      <ScheduleInterviewModal
        isOpen={!!scheduleCandidate && canAdd("recruitment")}
        onClose={() => setScheduleCandidate(null)}
        existingCandidate={scheduleCandidate}
      />
    </div>
  );
}

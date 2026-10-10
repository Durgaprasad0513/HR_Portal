const csvCell = (value: unknown) => {
  let text = String(value ?? "");
  // Spreadsheet applications must treat user-entered cells as text.
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
};

export function interviewCsv(candidates: any[]) {
  const rows = candidates.map((candidate) =>
    [
      candidate.candidateName,
      candidate.requisition?.positionTitle || "",
      candidate.interviewDate || "Not Scheduled",
      candidate.interviewLocation || "In-person",
      candidate.interviewer
        ? `${candidate.interviewer.firstName} ${candidate.interviewer.lastName}`
        : "Unassigned",
      candidate.interviewRound || "HR_INTERVIEW",
      candidate.selectionStatus || "IN_PROGRESS",
      candidate.interviewFeedback || "",
      candidate.status || "SCHEDULED",
      candidate.endsAt || "",
      candidate.timezone || "Asia/Kolkata",
    ]
      .map(csvCell)
      .join(","),
  );
  return [
    "Candidate Name,Role,Interview Date,Location,Interviewer,Round,Candidate Outcome,Feedback,Appointment Status,End Time,Timezone",
    ...rows,
  ].join("\r\n");
}

export function candidateCsv(candidates: any[]) {
  const rows = candidates.map((c) =>
    [
      c.candidateName,
      c.email,
      c.mobile,
      c.qualification,
      c.totalExperience ?? 0,
      c.currentCompany,
      c.currentSalary ?? "",
      c.expectedSalary ?? "",
      c.noticePeriod ?? 0,
      c.screeningStatus,
      c.selectionStatus,
      c.offerStatus,
    ]
      .map(csvCell)
      .join(","),
  );
  return [
    "Name,Email,Mobile,Qualification,Total Exp (Yrs),Current Co.,Current Salary,Expected Salary,Notice Period (Days),Screening Status,Interview Status,Offer Status",
    ...rows,
  ].join("\r\n");
}

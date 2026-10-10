import { z } from "zod";
const interviewRoundSchema = z.enum([
  "TELEPHONIC",
  "HR_INTERVIEW",
  "TECHNICAL",
  "MANAGEMENT",
]);
const dateSchema = z.string().datetime({ offset: true });

export const createRequisitionSchema = z.object({
  positionTitle: z.string().min(1),
  location: z.string().min(1),
  numberOfVacancies: z.number().int().min(1),
  requisitionDate: dateSchema.optional(),
  departmentId: z.string(),
});

export const updateRequisitionSchema = z.object({
  positionTitle: z.string().trim().min(1).optional(),
  departmentId: z.string().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  numberOfVacancies: z.number().int().min(1).optional(),
});

export const updateRequisitionStatusSchema = z.object({
  reason: z.string().trim().min(1).optional(),
  status: z.enum([
    "REQUIREMENT",
    "SOURCING",
    "SCREENING",
    "TELEPHONIC",
    "HR_INTERVIEW",
    "TECHNICAL",
    "MANAGEMENT",
    "SELECTED",
    "OFFER",
    "JOINED_REJECTED",
    "CLOSED",
  ]),
});

export const createCandidateSchema = z.object({
  candidateName: z.string().min(1),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  qualification: z.string().optional(),
  totalExperience: z.number().optional(),
  currentCompany: z.string().optional(),
  currentSalary: z.number().optional(),
  expectedSalary: z.number().optional(),
  noticePeriod: z.number().optional(),
  source: z.string().optional(),
  requisitionId: z.string(),
  interviewDate: dateSchema.optional(),
  screeningStatus: z
    .enum(["SCREENING_PENDING", "SHORTLISTED", "SCREENING_REJECTED"])
    .optional(),
  interviewerId: z.string().optional(),
  interviewRound: interviewRoundSchema.optional(),
  interviewLocation: z.string().optional(),
  interviewDurationMinutes: z.number().int().min(15).max(480).optional(),
  interviewMode: z.enum(["IN_PERSON", "VIDEO", "PHONE"]).optional(),
});

export const screenCandidateSchema = z.object({
  screeningStatus: z.enum([
    "SCREENING_PENDING",
    "SHORTLISTED",
    "SCREENING_REJECTED",
  ]),
  screeningNotes: z.string().optional(),
});

export const interviewCandidateSchema = z.object({
  interviewRound: interviewRoundSchema.optional(),
  interviewDate: dateSchema.optional(),
  interviewLocation: z.string().trim().min(1).optional(),
  interviewFeedback: z.string().optional(),
  interviewScore: z.number().int().min(0).optional(),
  selectionStatus: z
    .enum(["SELECTED", "SELECTION_REJECTED", "SELECTION_ON_HOLD"])
    .nullable()
    .optional(),
  interviewerId: z.string().optional(),
});

export const offerCandidateSchema = z.object({
  offerStatus: z.enum([
    "NOT_RELEASED",
    "RELEASED",
    "OFFER_ACCEPTED",
    "OFFER_DECLINED",
  ]),
  offerDate: dateSchema.optional(),
  offeredSalary: z.number().min(0).optional(),
  joiningDate: dateSchema.optional(),
  joiningStatus: z.enum(["PENDING", "JOINED", "NOT_JOINED"]).optional(),
  actualJoiningDate: dateSchema.optional(),
});

const interviewScheduleFields = z.object({
  round: interviewRoundSchema,
  startsAt: dateSchema,
  endsAt: dateSchema,
  timezone: z.string().min(1).default("Asia/Kolkata"),
  mode: z.enum(["IN_PERSON", "VIDEO", "PHONE"]).default("IN_PERSON"),
  location: z.string().optional(),
  interviewerId: z.string().optional(),
});

export const createInterviewSchema = interviewScheduleFields.refine(
  (value) => new Date(value.endsAt) > new Date(value.startsAt),
  {
    path: ["endsAt"],
    message: "End time must be after start time",
  },
);

export const updateInterviewScheduleSchema = interviewScheduleFields
  .extend({
    reason: z.string().trim().min(1).default("Rescheduled"),
  })
  .refine((value) => new Date(value.endsAt) > new Date(value.startsAt), {
    path: ["endsAt"],
    message: "End time must be after start time",
  });

export const updateInterviewStatusSchema = z
  .object({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
    reason: z.string().trim().min(1).optional(),
  })
  .refine(
    (value) =>
      !["CANCELLED", "NO_SHOW"].includes(value.status) || !!value.reason,
    {
      path: ["reason"],
      message: "A reason is required when cancelling or marking a no-show",
    },
  );

export const interviewFeedbackSchema = z.object({
  draft: z.boolean().default(false),
  revisionReason: z.string().trim().min(1).optional(),
  feedback: z.string().trim().min(1),
  score: z.number().int().min(1).max(10).optional(),
  recommendation: z.enum(["STRONG_YES", "YES", "HOLD", "NO"]).optional(),
});

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR', 'HR_EXECUTIVE', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'WEEKEND', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('CASUAL', 'SICK', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('PERMANENT', 'CONTRACT', 'INTERN');

-- CreateEnum
CREATE TYPE "ExitType" AS ENUM ('VOLUNTARY', 'INVOLUNTARY');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'AADHAAR', 'PAN', 'EDUCATIONAL_CERTIFICATE', 'EXPERIENCE_CERTIFICATE', 'APPOINTMENT_LETTER', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'VERIFICATION_REJECTED');

-- CreateEnum
CREATE TYPE "TravelMode" AS ENUM ('AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('APPROVAL_PENDING', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('UNSETTLED', 'SETTLED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('LAPTOP', 'DESKTOP', 'MOBILE', 'SIM', 'ID_CARD', 'LAPTOP_BAG', 'VEHICLE', 'TOOLS', 'MACHINERY_TOOL', 'ASSET_OTHER');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('IT', 'NON_IT', 'VEHICLE_CAT');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('NEW', 'GOOD', 'FAIR');

-- CreateEnum
CREATE TYPE "AssetReturnCondition" AS ENUM ('RETURN_GOOD', 'RETURN_DAMAGED', 'RETURN_LOST');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('IN_USE', 'RETURNED', 'DAMAGED', 'LOST', 'RETIRED');

-- CreateEnum
CREATE TYPE "RequisitionStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ScreeningStatus" AS ENUM ('SCREENING_PENDING', 'SHORTLISTED', 'SCREENING_REJECTED');

-- CreateEnum
CREATE TYPE "SelectionStatus" AS ENUM ('SELECTED', 'SELECTION_REJECTED', 'SELECTION_ON_HOLD');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('NOT_RELEASED', 'RELEASED', 'OFFER_ACCEPTED', 'OFFER_DECLINED');

-- CreateEnum
CREATE TYPE "ReviewPeriod" AS ENUM ('QUARTERLY', 'HALF_YEARLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "TrainingAttendanceStatus" AS ENUM ('TRAINING_PRESENT', 'TRAINING_ABSENT');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('LEAVE_QUERY', 'SALARY_QUERY', 'DOCUMENT_REQUEST', 'EXPERIENCE_LETTER', 'PAYSLIP', 'JOINING_DOCUMENTS', 'GENERAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'TICKET_CLOSED');

-- CreateEnum
CREATE TYPE "PolicyCategory" AS ENUM ('LEAVE_POLICY', 'ATTENDANCE_POLICY', 'TRAVEL_POLICY', 'CODE_OF_CONDUCT', 'RECRUITMENT_POLICY', 'PERFORMANCE_POLICY', 'TRAINING_POLICY', 'POSH', 'SAFETY', 'CIRCULAR', 'FORM', 'SOP');

-- CreateEnum
CREATE TYPE "AcknowledgementStatus" AS ENUM ('ACK_PENDING', 'ACKNOWLEDGED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('JOINING', 'INTERVIEW', 'OFFER', 'RESIGNATION', 'TRAVEL_NOTIF', 'ASSET_NOTIF', 'REVIEW_DUE', 'TRAINING_NOTIF', 'QUERY_NOTIF', 'POLICY_UPLOAD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "employeeId" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "passwordLastChangedAt" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 30,
    "deactivatedAt" TIMESTAMP(3),
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT DEFAULT 'India',
    "maritalStatus" "MaritalStatus",
    "alternateMobile" TEXT,
    "personalEmail" TEXT,
    "permanentAddress" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactRelation" TEXT,
    "emergencyContactNumber" TEXT,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "designation" TEXT NOT NULL,
    "salary" DECIMAL(65,30),
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "profilePhoto" TEXT,
    "grade" TEXT,
    "location" TEXT,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'PERMANENT',
    "probationPeriod" INTEGER,
    "confirmationDate" TIMESTAMP(3),
    "resignationDate" TIMESTAMP(3),
    "noticePeriod" INTEGER,
    "lastWorkingDate" TIMESTAMP(3),
    "exitType" "ExitType",
    "exitReason" TEXT,
    "ctc" DECIMAL(65,30),
    "basicSalary" DECIMAL(65,30),
    "grossSalary" DECIMAL(65,30),
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "ifscCode" TEXT,
    "pfNumber" TEXT,
    "uanNumber" TEXT,
    "esiNumber" TEXT,
    "panNumber" TEXT,
    "aadhaarNumber" TEXT,
    "statutoryRemarks" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" TIMESTAMP(3),
    "departmentId" TEXT,
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "headId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "clockIn" TIMESTAMP(3),
    "clockOut" TIMESTAMP(3),
    "workHours" DECIMAL(65,30),
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaves" (
    "id" TEXT NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalDays" DECIMAL(65,30) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "employeeId" TEXT NOT NULL,
    "approverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balances" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "totalDays" DECIMAL(65,30) NOT NULL,
    "usedDays" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "remainingDays" DECIMAL(65,30) NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_documents" (
    "id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "expiryDate" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,
    "uploadedById" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_requests" (
    "id" TEXT NOT NULL,
    "travelPurpose" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "travelMode" "TravelMode" NOT NULL,
    "advanceRequested" DECIMAL(65,30),
    "advanceApproved" DECIMAL(65,30),
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'APPROVAL_PENDING',
    "approvalDate" TIMESTAMP(3),
    "hotelExpense" DECIMAL(65,30),
    "foodAllowance" DECIMAL(65,30),
    "localConveyance" DECIMAL(65,30),
    "otherExpenses" DECIMAL(65,30),
    "totalExpenseClaimed" DECIMAL(65,30),
    "billUpload" TEXT,
    "amountPayable" DECIMAL(65,30),
    "settlementStatus" "SettlementStatus" NOT NULL DEFAULT 'UNSETTLED',
    "settlementDate" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,
    "approverId" TEXT,
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "assetCategory" "AssetCategory" NOT NULL,
    "brandModel" TEXT,
    "serialNumber" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchaseValue" DECIMAL(65,30),
    "vendor" TEXT,
    "warrantyExpiryDate" TIMESTAMP(3),
    "issueDate" TIMESTAMP(3),
    "issueCondition" "AssetCondition",
    "assetLocation" TEXT,
    "returnDate" TIMESTAMP(3),
    "returnCondition" "AssetReturnCondition",
    "status" "AssetStatus" NOT NULL DEFAULT 'IN_USE',
    "remarks" TEXT,
    "assignedEmployeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisitions" (
    "id" TEXT NOT NULL,
    "positionTitle" TEXT NOT NULL,
    "location" TEXT,
    "numberOfVacancies" INTEGER NOT NULL DEFAULT 1,
    "requisitionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequisitionStatus" NOT NULL DEFAULT 'OPEN',
    "departmentId" TEXT,
    "raisedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requisitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "qualification" TEXT,
    "totalExperience" DECIMAL(65,30),
    "currentCompany" TEXT,
    "currentSalary" DECIMAL(65,30),
    "expectedSalary" DECIMAL(65,30),
    "noticePeriod" INTEGER,
    "source" TEXT,
    "resumePath" TEXT,
    "screeningStatus" "ScreeningStatus" NOT NULL DEFAULT 'SCREENING_PENDING',
    "screeningNotes" TEXT,
    "interviewRound" TEXT,
    "interviewDate" TIMESTAMP(3),
    "interviewFeedback" TEXT,
    "interviewScore" INTEGER,
    "selectionStatus" "SelectionStatus",
    "offerStatus" "OfferStatus",
    "offerDate" TIMESTAMP(3),
    "offeredSalary" DECIMAL(65,30),
    "joiningDate" TIMESTAMP(3),
    "rejectionStage" TEXT,
    "rejectionReason" TEXT,
    "recruitmentCost" DECIMAL(65,30),
    "requisitionId" TEXT NOT NULL,
    "interviewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_reviews" (
    "id" TEXT NOT NULL,
    "reviewPeriod" "ReviewPeriod" NOT NULL,
    "kraDescription" TEXT,
    "kpiWeightage" DECIMAL(65,30),
    "goalDescription" TEXT,
    "targetValue" TEXT,
    "achievedValue" TEXT,
    "selfRating" DECIMAL(65,30),
    "managerRating" DECIMAL(65,30),
    "hrRating" DECIMAL(65,30),
    "finalRating" DECIMAL(65,30),
    "managerComments" TEXT,
    "employeeComments" TEXT,
    "hrComments" TEXT,
    "strengths" TEXT,
    "areasOfImprovement" TEXT,
    "trainingRequirement" TEXT,
    "promotionRecommendation" BOOLEAN NOT NULL DEFAULT false,
    "salaryRevisionRecommendation" TEXT,
    "finalApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'APPROVAL_PENDING',
    "finalApprovalDate" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,
    "finalApprovedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" TEXT NOT NULL,
    "trainingTopic" TEXT NOT NULL,
    "trainingType" "TrainingType" NOT NULL,
    "trainerName" TEXT,
    "trainingDate" DATE NOT NULL,
    "trainingLocation" TEXT,
    "trainingCost" DECIMAL(65,30),
    "trainingHours" DECIMAL(65,30),
    "targetDepartmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_participants" (
    "id" TEXT NOT NULL,
    "attendanceStatus" "TrainingAttendanceStatus" NOT NULL DEFAULT 'TRAINING_PRESENT',
    "feedbackRating" DECIMAL(65,30),
    "feedbackComments" TEXT,
    "assessmentScore" DECIMAL(65,30),
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "certificateFile" TEXT,
    "trainingId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_requests" (
    "id" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'SUBMITTED',
    "responseNotes" TEXT,
    "resolutionDate" TIMESTAMP(3),
    "closureDate" TIMESTAMP(3),
    "slaDueDate" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "policyName" TEXT NOT NULL,
    "policyCategory" "PolicyCategory" NOT NULL,
    "versionNumber" TEXT NOT NULL DEFAULT 'v1.0',
    "filePath" TEXT NOT NULL,
    "applicableTo" TEXT NOT NULL DEFAULT 'ALL',
    "acknowledgementRequired" BOOLEAN NOT NULL DEFAULT false,
    "uploadedById" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_acknowledgements" (
    "id" TEXT NOT NULL,
    "acknowledgementStatus" "AcknowledgementStatus" NOT NULL DEFAULT 'ACK_PENDING',
    "acknowledgementDate" TIMESTAMP(3),
    "policyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_acknowledgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "triggerEvent" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "deliveryChannel" TEXT NOT NULL DEFAULT 'IN_APP',
    "recipientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actionPerformed" TEXT NOT NULL,
    "moduleAffected" TEXT NOT NULL,
    "recordIdAffected" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "ipAddress" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "id" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutTime" TIMESTAMP(3),
    "ipAddress" TEXT,
    "deviceBrowser" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_permissions" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "module" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canAdd" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,
    "canViewRestricted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "minPasswordLength" INTEGER NOT NULL DEFAULT 8,
    "requireUppercase" BOOLEAN NOT NULL DEFAULT true,
    "requireNumbers" BOOLEAN NOT NULL DEFAULT true,
    "requireSpecialChars" BOOLEAN NOT NULL DEFAULT true,
    "passwordExpiryDays" INTEGER NOT NULL DEFAULT 90,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeCode_key" ON "employees"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_headId_key" ON "departments"("headId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_employeeId_date_key" ON "attendance"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balances_employeeId_year_leaveType_key" ON "leave_balances"("employeeId", "year", "leaveType");

-- CreateIndex
CREATE UNIQUE INDEX "assets_serialNumber_key" ON "assets"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "training_participants_trainingId_employeeId_key" ON "training_participants"("trainingId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "policy_acknowledgements_policyId_employeeId_key" ON "policy_acknowledgements"("policyId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "module_permissions_role_module_key" ON "module_permissions"("role", "module");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_headId_fkey" FOREIGN KEY ("headId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_assignedEmployeeId_fkey" FOREIGN KEY ("assignedEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisitions" ADD CONSTRAINT "requisitions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisitions" ADD CONSTRAINT "requisitions_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "requisitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_finalApprovedById_fkey" FOREIGN KEY ("finalApprovedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_targetDepartmentId_fkey" FOREIGN KEY ("targetDepartmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_participants" ADD CONSTRAINT "training_participants_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_participants" ADD CONSTRAINT "training_participants_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_requests" ADD CONSTRAINT "employee_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_requests" ADD CONSTRAINT "employee_requests_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_acknowledgements" ADD CONSTRAINT "policy_acknowledgements_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_acknowledgements" ADD CONSTRAINT "policy_acknowledgements_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_permissions" ADD CONSTRAINT "module_permissions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

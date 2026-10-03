import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { employeesApi } from '@/api/employees';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, FileText, CheckCircle2, Download, QrCode, User, 
  Briefcase, Wallet, MonitorPlay, FileCheck, Award
} from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';

function DetailBlock({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-border">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{value || '-'}</p>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHR = user?.role === 'ADMIN' || user?.role === 'HR';
  const queryClient = useQueryClient();

  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const deactivateMutation = { mutate: (id: string) => {}, isPending: false }; // stub for now

  const { data: empData, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id!),
  });

  const verifyDocumentMutation = useMutation({
    mutationFn: (documentId: string) => employeesApi.verifyDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (!empData?.data) return <div className="p-6 text-red-500">Employee not found.</div>;

  const emp = empData.data;
  const canEdit = isHR || user?.employeeId === emp.id;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={() => navigate(`/employees/${id}/edit`)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="bg-[#11112B] dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-white">
        <div className="h-32 w-32 shrink-0 rounded-[1.5rem] overflow-hidden border-4 border-white/10 bg-slate-800 flex items-center justify-center text-4xl font-bold">
          {emp.profilePhoto ? (
            <img src={emp.profilePhoto} alt={emp.firstName} className="h-full w-full object-cover" />
          ) : (
            <span>{emp.firstName?.[0]}{emp.lastName?.[0]}</span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{emp.firstName} {emp.lastName}</h1>
            <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              {emp.employeeCode}
            </span>
          </div>
          <h2 className="text-indigo-200 text-lg font-medium mt-1">{emp.designation || 'No Designation'}</h2>
          <p className="text-slate-400 text-sm mt-1">{emp.department?.name || 'Unassigned'} • {emp.office?.name || 'Unassigned'}</p>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-3 mt-6">
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30 whitespace-nowrap">
              <QrCode className="w-3.5 h-3.5" /> Digital ID Card & QR Pass
            </div>
            <div className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-indigo-500/30 whitespace-nowrap">
              Joined: {emp.dateOfJoining ? formatDate(emp.dateOfJoining) : '-'}
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-500/30 whitespace-nowrap">
              Status: {emp.status}
            </div>
          </div>
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailBlock label="Gender" value={emp.gender} />
          <DetailBlock label="Date of Birth" value={emp.dateOfBirth ? formatDate(emp.dateOfBirth) : ''} />
          <DetailBlock label="Mobile Phone" value={emp.phone} />
          <DetailBlock label="Official Email" value={emp.email} />
          <DetailBlock label="Residential Address" value={emp.address} />
          <DetailBlock label="Emergency Contact" value={emp.emergencyContactName ? `${emp.emergencyContactPhone} (${emp.emergencyContactName})` : emp.emergencyContactPhone} />
        </div>
      </div>

      {/* EMPLOYMENT & REPORTING STRUCTURE */}
      <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employment & Reporting Structure</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailBlock label="Assigned Department" value={emp.department?.name} />
          <DetailBlock label="Official Designation" value={emp.designation} />
          <DetailBlock label="Reporting Manager" value={emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : 'None'} />
          <DetailBlock label="Operating Base / Plant" value={emp.office?.name} />
          <DetailBlock label="Employment Type" value={emp.employmentType?.replace(/_/g, ' ')} />
          <DetailBlock label="Confirmation Date" value={emp.confirmationDate ? formatDate(emp.confirmationDate) : 'Not Applicable'} />
        </div>
      </div>

      {/* PAYROLL */}
      {isHR && (
        <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payroll & HR Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailBlock label="UAN Number" value={emp.uanNumber} />
            <DetailBlock label="PF Number" value={emp.pfNumber} />
            <DetailBlock label="ESI Number" value={emp.esiNumber} />
            <DetailBlock label="PAN Number" value={emp.panNumber} />
            <DetailBlock label="Bank Account" value={emp.bankAccountNumber ? `${emp.bankAccountNumber} (${emp.bankName || 'Unknown Bank'})` : ''} />
            <DetailBlock label="Base Salary" value={emp.baseSalary ? `₹${emp.baseSalary.toLocaleString()}` : ''} />
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Verified Documents & Certificates</h2>
        </div>
        {emp.documents && emp.documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {emp.documents.map((doc: any) => (
              <div key={doc.id} className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-border rounded-2xl">
                <div className="bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                  <FileText className="text-indigo-500 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{doc.documentName}</h4>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{doc.documentType.replace('_', ' ')} • {formatDate(doc.uploadDate)}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-bold">
                    {doc.verificationStatus === 'VERIFIED' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                          Pending Review
                        </span>
                        {isHR && (
                          <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => verifyDocumentMutation.mutate(doc.id)} isLoading={verifyDocumentMutation.isPending}>
                            Verify
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 font-medium">No verified documents available.</p>
        )}
      </div>

      {/* ASSETS */}
      <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MonitorPlay className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assigned Assets</h2>
          </div>
          {emp.assignedAssets?.length > 0 && (
            <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + "Asset ID,Type,Brand/Model,Serial Number,Purchase Date,Purchase Value,Issue Date,Condition,Status\n" + emp.assignedAssets.map((a: any) => `${a.id},${a.assetType},${a.brandModel || ''},${a.serialNumber || ''},${a.purchaseDate ? formatDate(a.purchaseDate) : ''},${a.purchaseValue || ''},${a.issueDate ? formatDate(a.issueDate) : ''},${a.issueCondition || ''},${a.status}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Asset_History_${emp.firstName}_${emp.lastName}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          )}
        </div>
        {(!emp.assignedAssets || emp.assignedAssets.length === 0) ? (
          <p className="text-sm text-slate-500 font-medium">No assets currently assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {emp.assignedAssets.map((asset: any) => (
              <div key={asset.id} className="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{asset.assetType}</span>
                  <Badge variant={asset.status === 'IN_USE' ? 'success' : 'default'} className="text-[10px] h-5">{asset.status.replace('_', ' ')}</Badge>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{asset.brandModel || 'Unknown Model'}</h4>
                <p className="text-[11px] text-slate-500 font-medium font-mono">SN: {asset.serialNumber || 'N/A'}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Issued: {asset.issueDate ? formatDate(asset.issueDate) : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      {/* TRAINING */}
      <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Training History</h2>
        </div>
        {(!emp.trainingParticipations || emp.trainingParticipations.length === 0) ? (
          <p className="text-sm text-slate-500 font-medium">No training records found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {emp.trainingParticipations.map((part: any) => (
              <div key={part.id} className="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{part.training?.trainingType || 'Training'}</span>
                  <Badge variant={part.attendanceStatus === 'TRAINING_PRESENT' ? 'success' : 'default'} className="text-[10px] h-5">
                    {part.attendanceStatus === 'TRAINING_PRESENT' ? 'Present' : 'Absent'}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{part.training?.trainingTopic || 'Untitled'}</h4>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>{part.training?.trainingDate ? formatDate(part.training.trainingDate) : '-'}</span>
                  {part.assessmentScore && <span>Score: {part.assessmentScore}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PERFORMANCE */}
      <div className="bg-white dark:bg-surface rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-border">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performance Reviews</h2>
        </div>
        {(!emp.performanceReviews || emp.performanceReviews.length === 0) ? (
          <p className="text-sm text-slate-500 font-medium">No performance reviews found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {emp.performanceReviews.map((review: any) => (
              <div key={review.id} className="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{review.reviewPeriod}</span>
                  <Badge variant={review.status === 'COMPLETED' ? 'success' : 'default'} className="text-[10px] h-5">
                    {review.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{review.goalDescription || 'No goals specified'}</h4>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                  <div>Self: {review.selfRating || '-'}</div>
                  <div>Manager: {review.managerRating || '-'}</div>
                  <div className="col-span-2 text-indigo-600 dark:text-indigo-400 font-bold mt-1">Final: {review.finalRating || '-'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
<ConfirmDialog isOpen={isDeactivateOpen} title="Deactivate Employee" message="Are you sure you want to deactivate this employee? They will lose access to the system immediately." confirmLabel="Deactivate" cancelLabel="Cancel" isDestructive={true} onConfirm={() => deactivateMutation.mutate(id as string)} onCancel={() => setIsDeactivateOpen(false)} />
    </div>
  );
}



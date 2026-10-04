import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Employee } from '@/types';
import { ShieldCheck, Droplet } from 'lucide-react';

interface DigitalIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export function DigitalIDCardModal({ isOpen, onClose, employee }: DigitalIDCardModalProps) {
  // Use current URL for QR code, simulating a verification link
  const verificationUrl = typeof window !== 'undefined' ? `${window.location.origin}/employees/${employee.id}` : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&color=064e3b`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital ID Pass" className="max-w-md bg-slate-50 dark:bg-slate-900/50">
      <div className="py-4 flex flex-col gap-6 items-center overflow-y-auto max-h-[75vh] px-2 scrollbar-hide">
        
        {/* FRONT OF CARD */}
        <div className="bg-white dark:bg-surface rounded-[2rem] shadow-xl overflow-hidden w-full max-w-[320px] border border-slate-200 dark:border-slate-700 relative shrink-0">
          {/* Top colored strip / lanyard hole area */}
          <div className="h-20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700"></div>
          </div>
          
          <div className="flex flex-col items-center -mt-10 px-6 pb-6">
            <div className="relative">
              {employee.profilePhoto ? (
                <img src={employee.profilePhoto} alt="Profile" className="w-24 h-24 rounded-[1.25rem] object-cover border-4 border-white dark:border-surface shadow-sm bg-slate-100" />
              ) : (
                <div className="w-24 h-24 rounded-[1.25rem] border-4 border-white dark:border-surface shadow-sm bg-brand-primary flex items-center justify-center text-white text-3xl font-bold">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-surface tracking-wide">
                ACTIVE
              </span>
            </div>
            
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white text-center leading-tight">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 text-center">
              {employee.designation || 'Employee'}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 text-center">
              {employee.department?.name || 'General Department'}
            </p>
            
            <div className="flex items-center gap-2 mt-5">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                ID: {employee.employeeCode}
              </span>
              <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-500/20 flex items-center gap-1.5">
                 <Droplet className="w-3 h-3" strokeWidth={3} /> {employee.bloodGroup || 'O+'}
              </span>
            </div>
          </div>
          
          <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border-t border-emerald-100 dark:border-emerald-500/10 p-5 flex items-center justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] mb-1">
                <ShieldCheck className="w-4 h-4" /> VERIFIED QR PASS
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                Scan with any smartphone camera to view verified staff slip.
              </p>
            </div>
            <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-200 shrink-0">
              <img src={qrCodeUrl} alt="QR Pass" className="w-14 h-14 object-contain" crossOrigin="anonymous" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}



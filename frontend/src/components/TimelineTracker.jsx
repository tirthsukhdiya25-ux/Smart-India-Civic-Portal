import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Wrench, 
  FileCheck2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

const STEPS = [
  { key: 'Submitted', label: 'Complaint Submitted', icon: Clock },
  { key: 'Under Review', label: 'Under Review', icon: FileCheck2 },
  { key: 'Assigned to Department', label: 'Assigned to Department', icon: UserCheck },
  { key: 'Work in Progress', label: 'Work in Progress', icon: Wrench },
  { key: 'Resolved', label: 'Issue Resolved', icon: CheckCircle2 }
];

export const TimelineTracker = ({ complaint }) => {
  if (!complaint) return null;

  const currentStatus = complaint.status || 'Submitted';
  const isRejected = currentStatus === 'Rejected';

  const getStepStatus = (stepKey, index) => {
    if (isRejected) {
      if (index === 0) return 'completed';
      return 'inactive';
    }

    const order = ['Submitted', 'Under Review', 'Assigned to Department', 'Work in Progress', 'Resolved'];
    const currentIndex = order.indexOf(currentStatus);

    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">Complaint Life Cycle</span>
          <h3 className="text-lg font-bold text-slate-800">Action & Verification Stepper</h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Tracking ID: <span className="font-mono font-bold text-slate-800">{complaint.complaintId}</span>
        </div>
      </div>

      {isRejected ? (
        <div className="my-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-900 text-sm">Complaint Status: Rejected</h4>
            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
              Reason: {complaint.rejectionReason || 'The civic report could not be verified or is outside municipal jurisdiction.'}
            </p>
          </div>
        </div>
      ) : (
        /* Stepper Desktop / Mobile */
        <div className="py-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
            {STEPS.map((step, idx) => {
              const status = getStepStatus(step.key, idx);
              const StepIcon = step.icon;

              let circleClass = 'bg-slate-100 text-slate-400 border-slate-200';
              let textClass = 'text-slate-400';

              if (status === 'completed') {
                circleClass = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
                textClass = 'text-slate-800 font-semibold';
              } else if (status === 'current') {
                circleClass = 'bg-saffron-500 text-white border-saffron-500 ring-4 ring-orange-100 animate-pulse';
                textClass = 'text-saffron-700 font-bold';
              }

              return (
                <div key={step.key} className="flex flex-col items-center text-center relative group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${circleClass}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2.5 max-w-[120px] transition-colors ${textClass}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Remarks Log */}
      <div className="mt-4 pt-5 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Official Audit & Action Log ({complaint.remarks?.length || 0})
        </h4>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {complaint.remarks && complaint.remarks.length > 0 ? (
            complaint.remarks.map((rem, rIdx) => (
              <div key={rIdx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span className="font-semibold text-slate-700">{rem.by}</span>
                  <span>{new Date(rem.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
                <p className="text-slate-700">{rem.text}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No formal action remarks logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

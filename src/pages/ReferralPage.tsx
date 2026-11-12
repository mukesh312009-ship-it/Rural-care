import React, { useState, useEffect } from 'react';
import {
  Share2,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  FileCheck,
  Send,
  Hospital,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { Referral, ReferralStatus, ReferralPriority } from '../types';

export const ReferralPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const facilities = dataService.getFacilities();

  // Create Form
  const [toFacilityId, setToFacilityId] = useState(facilities[1]?.id || '');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<ReferralPriority>('Normal');

  useEffect(() => {
    refreshReferrals();
  }, []);

  const refreshReferrals = () => {
    setReferrals(dataService.getReferrals());
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    dataService.createReferral({
      patient_id: 'd0000001-0000-0000-0000-000000000001',
      patient_name: 'Muthuvel Karuppan',
      referring_doctor_id: 'c0000001-0000-0000-0000-000000000001',
      from_facility_id: facilities[0]?.id || 'b0000001-0000-0000-0000-000000000001',
      to_facility_id: toFacilityId,
      referral_reason: reason,
      priority,
    });

    setIsCreateModalOpen(false);
    setReason('');
    refreshReferrals();
    showToast(
      language === 'ta'
        ? 'மருத்துவ பரிந்துரை உருவாக்கப்பட்டு உயர் மருத்துவமனைக்கு அனுப்பப்பட்டது!'
        : 'Referral dispatched to tertiary healthcare centre!'
    );
  };

  const handleStatusUpdate = (id: string, status: ReferralStatus) => {
    dataService.updateReferralStatus(
      id,
      status,
      status === 'Completed'
        ? 'Specialist consultation done. Patient advised continuation of management at PHC.'
        : undefined
    );
    refreshReferrals();
    showToast(
      language === 'ta'
        ? `பரிந்துரை நிலை மாற்றப்பட்டது: ${status}`
        : `Referral status updated to ${status}`
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getPriorityBadge = (p: ReferralPriority) => {
    switch (p) {
      case 'Emergency':
        return 'bg-rose-600 text-white animate-pulse';
      case 'Urgent':
        return 'bg-amber-600 text-white';
      case 'Normal':
        return 'bg-teal-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const workflowSteps: ReferralStatus[] = ['Created', 'Sent', 'Accepted', 'In Progress', 'Completed'];

  const filteredReferrals = referrals.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-teal-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'ஸ்மார்ட் மருத்துவ பரிந்துரை மேலாண்மை' : 'Smart Referral Management'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'ஆரம்ப சுகாதார நிலையத்திலிருந்து தாலுகா மற்றும் மாவட்ட மருத்துவமனைக்கு நோயாளியை பரிந்துரைத்தல்.'
                  : 'Track cross-facility patient referrals, specialist consultations, and receiving hospital outcomes.'}
              </p>
            </div>
          </div>
        </div>

        {(role === 'doctor' || role === 'facility_admin') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய பரிந்துரை செய்' : 'New Referral Request'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Sent', 'Accepted', 'In Progress', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setActiveFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeFilter === st
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All Referrals') : st}
          </button>
        ))}
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {filteredReferrals.map((ref) => {
          const currentStepIndex = workflowSteps.indexOf(ref.status);
          return (
            <div
              key={ref.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {ref.from_facility_name} ➔ {ref.to_facility_name}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">
                      {language === 'ta' ? 'நோயாளி:' : 'Patient:'} <strong>{ref.patient_name}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getPriorityBadge(ref.priority)}`}>
                    {ref.priority} Priority
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {ref.referral_date}
                  </span>
                </div>
              </div>

              {/* Workflow Stepper */}
              <div className="p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  {workflowSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition ${
                            isDone ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
                          } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                        >
                          {idx + 1}
                        </div>
                        <span className={`truncate text-center ${isCurrent ? 'text-teal-800 font-extrabold' : ''}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Referral Reason */}
              <div className="text-xs text-slate-700 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                <strong>{language === 'ta' ? 'பரிந்துரைக்கான காரணம் & மருத்துவக் குறிப்பு:' : 'Clinical Referral Reason:'}</strong>{' '}
                {ref.referral_reason}
              </div>

              {ref.outcome_summary && (
                <div className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <strong>{language === 'ta' ? 'பெறும் மருத்துவமனையின் முடிவு / அறிக்கை:' : 'Receiving Facility Outcome:'}</strong>{' '}
                  {ref.outcome_summary}
                </div>
              )}

              {/* Status Action Buttons for Healthcare Staff */}
              {(role === 'doctor' || role === 'facility_admin') && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  {ref.status === 'Sent' && (
                    <button
                      onClick={() => handleStatusUpdate(ref.id, 'Accepted')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                    >
                      {language === 'ta' ? 'ஏற்கவும் (Accept)' : 'Accept Referral'}
                    </button>
                  )}
                  {ref.status === 'Accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(ref.id, 'In Progress')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                    >
                      {language === 'ta' ? 'பரிசோதனை தொடங்கப்பட்டது' : 'Start Consultation'}
                    </button>
                  )}
                  {ref.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusUpdate(ref.id, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                    >
                      {language === 'ta' ? 'பரிந்துரை முடிவடைந்தது' : 'Complete Referral'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Referral Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'புதிய மருத்துவ பரிந்துரை (Referral)' : 'Create Specialist Referral'}
                </h2>
                <p className="text-xs text-teal-100">
                  {language === 'ta' ? 'உயர் மருத்துவமனைக்கு நோயாளியை மாற்றுதல்' : 'Tertiary or Taluk Hospital Dispatch'}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'பெறும் மருத்துவமனை:' : 'Destination Healthcare Facility:'}
                </label>
                <select
                  value={toFacilityId}
                  onChange={(e) => setToFacilityId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.village})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'முன்னுரிமை (Priority):' : 'Referral Urgency Level:'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ReferralPriority)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Normal">Normal (வழக்கமான பரிசோதனை)</option>
                  <option value="Urgent">Urgent (அவசர ஆய்வு தேவை)</option>
                  <option value="Emergency">Emergency (உடனடி தீவிர சிகிச்சை)</option>
                  <option value="Routine">Routine (வழக்கமான)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'பரிந்துரைக்கான காரணம் & மருத்துவ குறிப்பு:' : 'Reason & Specialist Instructions:'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ta'
                      ? 'எ.கா. கண் விழித்திரை ஆய்வு மற்றும் கார்டியாலஜி ஆலோசனை தேவை...'
                      : 'e.g. Ophthalmology diabetic retinopathy evaluation and cardiogram review...'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'பரிந்துரையை அனுப்புக' : 'Send Referral'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

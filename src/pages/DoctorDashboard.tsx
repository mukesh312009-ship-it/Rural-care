import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  CalendarCheck,
  Users,
  Clock,
  Share2,
  CheckCircle2,
  XCircle,
  Pill,
  ArrowRight,
  ListOrdered,
  FileText,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { Appointment } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    dataService.getAppointments(undefined, 'c0000001-0000-0000-0000-000000000001')
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingRequests = appointments.filter((a) => a.status === 'Requested');
  const confirmedToday = appointments.filter((a) => a.status === 'Confirmed');
  const followUps = dataService.getFollowUps();
  const referrals = dataService.getReferrals();

  const handleStatusChange = (id: string, newStatus: any) => {
    dataService.updateAppointmentStatus(id, newStatus);
    setAppointments(dataService.getAppointments(undefined, 'c0000001-0000-0000-0000-000000000001'));
    showToast(
      language === 'ta'
        ? `முன்பதிவு நிலை மாற்றப்பட்டது: ${newStatus}`
        : `Appointment status updated to ${newStatus}`
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {language === 'ta' ? 'அரசு அங்கீகாரம் பெற்ற மருத்துவர் போர்டல்' : 'Verified Medical Officer Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'ta'
              ? `மருத்துவர் கட்டுப்பாட்டு பலகை: ${user?.full_name}`
              : `Clinical Dashboard: ${user?.full_name}`}
          </h1>
          <p className="mt-2 text-blue-100 text-xs sm:text-sm leading-relaxed">
            {language === 'ta'
              ? 'அலங்காநல்லூர் ஆரம்ப சுகாதார நிலைய OPD ஆலோசனைகள், மருந்து சீட்டுகள் மற்றும் நோயாளிகள் தொடர் கண்காணிப்பு.'
              : 'Primary Health Centre consultations, patient triage, clinical prescriptions, and follow-up directives.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/medications"
              className="px-4 py-2 bg-white text-blue-900 rounded-xl text-xs font-extrabold hover:bg-blue-50 transition shadow-sm flex items-center gap-1.5"
            >
              <Pill className="w-4 h-4 text-blue-700" />
              <span>{language === 'ta' ? 'மருந்து சீட்டு எழுது (Rx)' : 'Prescribe (Rx)'}</span>
            </Link>
            <Link
              to="/followups"
              className="px-4 py-2 bg-blue-600/60 hover:bg-blue-600/80 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md"
            >
              <Clock className="w-4 h-4" />
              <span>{language === 'ta' ? 'தொடர் திட்டம் உருவாக்கு' : 'Create Follow-up'}</span>
            </Link>
            <Link
              to="/queue"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <ListOrdered className="w-4 h-4" />
              <span>{language === 'ta' ? 'OPD டோக்கன் வரிசை' : 'Call Next Token'}</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Stethoscope className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-600 font-bold">
            <span>{language === 'ta' ? 'நிலுவை முன்பதிவுகள்' : 'Pending Requests'}</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{pendingRequests.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Needs clinician review</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-600 font-bold">
            <span>{language === 'ta' ? 'உறுதிப்படுத்தப்பட்டவை' : 'Confirmed Today'}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-600">{confirmedToday.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled consultations</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-teal-600 font-bold">
            <span>{language === 'ta' ? 'செயலில் உள்ள தொடர் ஆய்வுகள்' : 'Active Follow-ups'}</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-teal-600">{followUps.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tracked by ASHA team</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-purple-600 font-bold">
            <span>{language === 'ta' ? 'பரிந்துரைகள்' : 'Dispatched Referrals'}</span>
            <Share2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-purple-600">{referrals.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tertiary care transfer</p>
        </div>
      </div>

      {/* Appointment Requests Triage Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>{language === 'ta' ? 'நோயாளி முன்பதிவு கோரிக்கைகள் (Triage)' : 'Patient Appointment Requests'}</span>
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
            {appointments.length} {language === 'ta' ? 'மொத்தம்' : 'Total'}
          </span>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{apt.patient_name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-white text-slate-700 border border-slate-200">
                    {apt.time_slot} – {apt.appointment_date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{language === 'ta' ? 'காரணம்:' : 'Chief Complaint:'}</strong> {apt.reason_for_visit}
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-800">
                  {apt.status}
                </span>

                {apt.status === 'Requested' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'ஏற்கவும்' : 'Accept'}</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Rejected')}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'நிராகரி' : 'Reject'}</span>
                    </button>
                  </>
                )}

                {apt.status === 'Confirmed' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'Completed')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'முடிந்தது' : 'Complete'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

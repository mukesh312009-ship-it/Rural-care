import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Pill,
  Clock,
  Share2,
  ShieldAlert,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ListOrdered,
  Tent,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';

export const PatientDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const appointments = dataService.getAppointments();
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Requested' || a.status === 'Confirmed'
  );
  const previousAppointments = appointments.filter((a) => a.status === 'Completed');

  const medications = dataService.getMedications().filter((m) => m.is_active);
  const followUps = dataService.getFollowUps();
  const pendingFollowUps = followUps.filter((f) => f.status === 'Due' || f.status === 'Overdue');
  const referrals = dataService.getReferrals();
  const queueTokens = dataService.getQueueTokens();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-3 py-1 rounded-full">
            {language === 'ta' ? 'நோயாளி கட்டுப்பாட்டு பலகை' : 'Patient Care Dashboard'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            {language === 'ta'
              ? `வணக்கம், ${user?.full_name || 'முத்துவேல்'}!`
              : `Welcome back, ${user?.full_name || 'Muthuvel'}!`}
          </h1>
          <p className="mt-2 text-teal-100 text-xs sm:text-sm leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் கிராமப்புற சுகாதார சேவைகள், மருத்துவர் முன்பதிவுகள், மருந்து நினைவூட்டல்கள் மற்றும் ஆஷா களப்பணி தகவல்கள் இங்கே ஒருங்கிணைக்கப்பட்டுள்ளன.'
              : 'Your village health appointments, medication reminders, and ASHA home visit schedule in one unified place.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/appointments"
              className="px-4 py-2 bg-white text-teal-900 rounded-xl text-xs font-bold hover:bg-teal-50 transition shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-teal-700" />
              <span>{language === 'ta' ? 'புதிய முன்பதிவு' : 'Book Appointment'}</span>
            </Link>
            <Link
              to="/facilities"
              className="px-4 py-2 bg-teal-600/60 hover:bg-teal-600/80 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md"
            >
              <Building2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'அருகிலுள்ள PHC' : 'Find Facilities'}</span>
            </Link>
            <Link
              to="/emergency"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{language === 'ta' ? 'அவசர உதவி 112' : 'Emergency 112'}</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Calendar className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/appointments"
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition group"
        >
          <div className="flex items-center justify-between text-xs text-teal-700 font-bold">
            <span>{language === 'ta' ? 'முன்பதிவுகள்' : 'Upcoming Visits'}</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 group-hover:text-teal-700">
            {upcomingAppointments.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {upcomingAppointments[0]?.appointment_date || 'None'}
          </p>
        </Link>

        <Link
          to="/medications"
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition group"
        >
          <div className="flex items-center justify-between text-xs text-teal-700 font-bold">
            <span>{language === 'ta' ? 'மருந்துகள்' : 'Active Medicines'}</span>
            <Pill className="w-4 h-4 text-teal-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 group-hover:text-teal-700">
            {medications.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">94% Daily Adherence</p>
        </Link>

        <Link
          to="/followups"
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 transition group"
        >
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
            <span>{language === 'ta' ? 'தொடர் பரிசோதனை' : 'Pending Follow-ups'}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">
            {pendingFollowUps.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Due with ASHA</p>
        </Link>

        <Link
          to="/queue"
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition group"
        >
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
            <span>{language === 'ta' ? 'OPD வரிசை' : 'Live OPD Token'}</span>
            <ListOrdered className="w-4 h-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-600">
            {queueTokens[0]?.token_code || 'PHC-014'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Waiting position 2</p>
        </Link>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Appointments & Medicine Reminders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Appointments Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>{language === 'ta' ? 'வரவிருக்கும் முன்பதிவுகள்' : 'Upcoming Appointments'}</span>
              </h2>
              <Link to="/appointments" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                <span>{language === 'ta' ? 'அனைத்தும்' : 'View All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {language === 'ta' ? 'வரவிருக்கும் முன்பதிவுகள் ஏதுமில்லை.' : 'No upcoming appointments.'}
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 2).map((apt) => (
                  <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{apt.doctor_name}</h3>
                      <p className="text-xs text-slate-500">{apt.facility_name}</p>
                      <p className="text-xs text-teal-700 font-semibold mt-1">
                        📅 {apt.appointment_date} at {apt.time_slot}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 shrink-0">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Medicine Schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>{language === 'ta' ? 'இன்றைய மருந்து நினைவூட்டல்' : 'Today’s Medications'}</span>
              </h2>
              <Link to="/medications" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                <span>{language === 'ta' ? 'அட்டவணை' : 'Full Schedule'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{med.medicine_name}</h3>
                    <p className="text-xs text-teal-700 font-medium">{med.dosage_instructions}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">⏰ {med.reminder_time}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Follow-ups, Referrals, Emergency */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Follow-ups Alert Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{language === 'ta' ? 'தொடர் கண்காணிப்பு' : 'Follow-up Status'}</span>
              </h2>
              <Link to="/followups" className="text-xs font-bold text-teal-700">
                {language === 'ta' ? 'விவரம்' : 'Details'}
              </Link>
            </div>

            {followUps.slice(0, 2).map((flw) => (
              <div key={flw.id} className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{flw.patient_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                    {flw.status}
                  </span>
                </div>
                <p className="text-slate-600">{flw.clinical_instructions}</p>
                <p className="text-[11px] text-amber-800 font-semibold">Target: {flw.target_date}</p>
              </div>
            ))}
          </div>

          {/* Referral Status Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>{language === 'ta' ? 'மருத்துவ பரிந்துரைகள்' : 'Referral Status'}</span>
              </h2>
              <Link to="/referrals" className="text-xs font-bold text-teal-700">
                {language === 'ta' ? 'அனைத்தும்' : 'Track'}
              </Link>
            </div>

            {referrals.slice(0, 1).map((ref) => (
              <div key={ref.id} className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ref.to_facility_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-900">
                    {ref.status}
                  </span>
                </div>
                <p className="text-slate-600">{ref.referral_reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

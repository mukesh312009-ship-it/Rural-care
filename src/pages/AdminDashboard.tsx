import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  CalendarCheck,
  Tent,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { Doctor } from '../types';

export const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const metrics = dataService.getAdminMetrics();
  const [doctors, setDoctors] = useState<Doctor[]>(() => dataService.getDoctors());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleVerifyDoctor = (doctorId: string) => {
    dataService.verifyDoctor(doctorId);
    setDoctors([...dataService.getDoctors()]);
    showToast(
      language === 'ta'
        ? 'மருத்துவர் தகுதிச்சான்றிதழ் சரிபார்க்கப்பட்டு மருத்துவ அனுமதி வழங்கப்பட்டது!'
        : 'Doctor credentials verified and clinical privileges approved!'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Recharts Data
  const monthlyActivityData = [
    { month: 'Jun', opd: 320, followups: 110, camps: 2 },
    { month: 'Jul', opd: 410, followups: 145, camps: 3 },
    { month: 'Aug', opd: 390, followups: 160, camps: 2 },
    { month: 'Sep', opd: 480, followups: 195, camps: 4 },
    { month: 'Oct', opd: 520, followups: 220, camps: 3 },
    { month: 'Nov', opd: 580, followups: 260, camps: 5 },
  ];

  const serviceCategoryData = [
    { name: 'General OPD', value: 45, color: '#0d9488' },
    { name: 'Maternal Care', value: 25, color: '#0284c7' },
    { name: 'NCD Screening', value: 20, color: '#f59e0b' },
    { name: 'Immunization', value: 10, color: '#10b981' },
  ];

  const auditLogs = [
    { id: 'aud-1', actor: 'Dr. Sundaram Senthil', action: 'CREATE_PRESCRIPTION', time: '10 mins ago' },
    { id: 'aud-2', actor: 'Kavitha Murugesan (ASHA)', action: 'RECORD_HOME_VISIT', time: '25 mins ago' },
    { id: 'aud-3', actor: 'Muthuvel Karuppan', action: 'BOOK_APPOINTMENT', time: '1 hour ago' },
    { id: 'aud-4', actor: 'System ABHA Gateway', action: 'SYNC_EHR_ARTIFACT', time: '2 hours ago' },
  ];

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
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {role === 'super_admin'
                ? (language === 'ta' ? 'மாநில சுகாதார கண்காணிப்பு அமைப்பு' : 'State Health Governance Panel')
                : (language === 'ta' ? 'வட்டார ஆரம்ப சுகாதார நிலைய நிர்வாகம்' : 'Block Health Administration')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'ta' ? 'ரூரல்கேர் நிர்வாக பலகை & புள்ளிவிவரங்கள்' : 'RuralCare Administrative Dashboard'}
          </h1>
          <p className="mt-2 text-teal-100 text-xs sm:text-sm leading-relaxed">
            {language === 'ta'
              ? 'மருத்துவர்கள் சரிபார்ப்பு, சுகாதார மையங்கள் கண்காணிப்பு, தணிக்கை பதிவுகள் மற்றும் கிராமப்புற மருத்துவ புள்ளிவிவரங்கள்.'
              : 'Operational health indicators, clinician credential verification, facility metrics, and audit logging.'}
          </p>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <BarChart3 className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-teal-700 font-bold">
            <span>{language === 'ta' ? 'பதிவுசெய்த நோயாளிகள்' : 'Total Patients'}</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{metrics.totalRegisteredPatients}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 8 rural panchayats</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
            <span>{language === 'ta' ? 'மருத்துவர்கள் & ஆஷாக்கள்' : 'Doctors & ASHA'}</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {metrics.totalDoctors} / {metrics.communityHealthWorkers}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.pendingDoctorVerifications} pending verification
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
            <span>{language === 'ta' ? 'முன்பதிவுகள் & வருகைகள்' : 'Consultations'}</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{metrics.totalAppointments}</p>
          <p className="text-[11px] text-slate-400 mt-1">This month alone</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
            <span>{language === 'ta' ? 'தொடர் கண்காணிப்பு' : 'Follow-ups'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{metrics.completedFollowUps}</p>
          <p className="text-[11px] text-slate-400 mt-1">High compliance</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Activity Trend BarChart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>{language === 'ta' ? 'மாதாந்திர OPD & தொடர் கண்காணிப்பு வளர்ச்சி' : 'Monthly Clinical Volume & Follow-ups'}</span>
              </h2>
              <p className="text-xs text-slate-500">OPD consultations vs home visits recorded</p>
            </div>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="opd" name="OPD Visits" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="followups" name="ASHA Follow-ups" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Category Breakdown PieChart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'சேவை வகைகள்' : 'Service Distribution'}</span>
            </h2>
            <p className="text-xs text-slate-500">Utilization across Primary Health Centres</p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {serviceCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {serviceCategoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Verification Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>
              {language === 'ta' ? 'மருத்துவர் தகுதிச்சான்றிதழ் சரிபார்ப்பு' : 'Doctor Verification & Privileges'}
            </span>
          </h2>
          <span className="text-xs text-slate-400">Clinical Verification Mandate</span>
        </div>

        <div className="space-y-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{doc.qualification} – {doc.specialization}</h3>
                  <span className="text-xs bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                    {doc.medical_registration_number}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{doc.facility_name}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                {doc.is_verified ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerifyDoctor(doc.id)}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'சான்றிதழை சரிபார் (Verify)' : 'Verify Credentials'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-600" />
          <span>{language === 'ta' ? 'அண்மைக்கால கணினி தணிக்கை பதிவுகள்' : 'Recent System Audit Logs'}</span>
        </h2>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-teal-700 font-bold">{log.action}</span>
                <span className="text-slate-500">by</span>
                <span className="font-semibold text-slate-800">{log.actor}</span>
              </div>
              <span className="text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

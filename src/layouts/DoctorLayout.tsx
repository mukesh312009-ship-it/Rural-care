import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Stethoscope,
  CalendarCheck,
  ClipboardList,
  Pill,
  Clock,
  Share2,
  CheckCircle2,
  AlertTriangle,
  User,
  ListOrdered,
} from 'lucide-react';
import { Header } from '../components/navigation/Header';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const DoctorLayout: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/doctor/dashboard', label: language === 'ta' ? 'மருத்துவர் முகப்பு' : 'Doctor Dashboard', icon: Stethoscope },
    { to: '/doctor/appointments', label: language === 'ta' ? 'முன்பதிவு மேலாண்மை' : 'Manage Appointments', icon: CalendarCheck },
    { to: '/queue', label: language === 'ta' ? 'நேரடி OPD வரிசை' : 'OPD Live Queue', icon: ListOrdered },
    { to: '/medications', label: language === 'ta' ? 'மருந்து சீட்டு (Rx)' : 'Prescriptions', icon: Pill },
    { to: '/followups', label: language === 'ta' ? 'தொடர் கண்காணிப்பு திட்டம்' : 'Follow-Up Planning', icon: Clock },
    { to: '/referrals', label: language === 'ta' ? 'மருத்துவ பரிந்துரைகள்' : 'Referral Workflow', icon: Share2 },
    { to: '/facilities', label: language === 'ta' ? 'சுகாதார நிலையங்கள்' : 'Facility Network', icon: ClipboardList },
    { to: '/profile', label: language === 'ta' ? 'மருத்துவர் விவரம்' : 'My Credentials', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <OfflineBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        {/* Doctor Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 sticky top-24 space-y-4">
            {/* Doctor Profile Banner */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">{user?.full_name}</h3>
                  <p className="text-[11px] text-blue-700 font-medium">TNMC-2014-88421</p>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட மருத்துவர்' : 'Verified Medical Officer'}</span>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Doctor Main Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

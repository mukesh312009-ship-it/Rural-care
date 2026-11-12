import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Pill,
  Clock,
  Building2,
  Share2,
  Users,
  ShieldAlert,
  User,
  ListOrdered,
  Tent,
} from 'lucide-react';
import { Header } from '../components/navigation/Header';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const PatientLayout: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/patient/dashboard', label: language === 'ta' ? 'முகப்பு பலகை' : 'Dashboard', icon: LayoutDashboard },
    { to: '/facilities', label: language === 'ta' ? 'மருத்துவமனைகள்' : 'Find Facilities', icon: Building2 },
    { to: '/appointments', label: language === 'ta' ? 'முன்பதிவு' : 'Appointments', icon: Calendar },
    { to: '/medications', label: language === 'ta' ? 'மருந்துகள்' : 'Medications', icon: Pill },
    { to: '/followups', label: language === 'ta' ? 'தொடர் பரிசோதனை' : 'Follow-ups', icon: Clock },
    { to: '/queue', label: language === 'ta' ? 'OPD டோக்கன்' : 'Queue Token', icon: ListOrdered },
    { to: '/referrals', label: language === 'ta' ? 'பரிந்துரைகள்' : 'Referrals', icon: Share2 },
    { to: '/health-camps', label: language === 'ta' ? 'மருத்துவ முகாம்கள்' : 'Health Camps', icon: Tent },
    { to: '/caregivers', label: language === 'ta' ? 'பராமரிப்பாளர்' : 'Caregiver Access', icon: Users },
    { to: '/profile', label: language === 'ta' ? 'என் சுயவிவரம்' : 'My Profile', icon: User },
    { to: '/emergency', label: language === 'ta' ? 'அவசர உதவி (112)' : 'Emergency Help', icon: ShieldAlert, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <OfflineBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        {/* Patient Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 sticky top-24 space-y-4">
            {/* User Mini Card */}
            <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                {user?.full_name?.charAt(0) || 'P'}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
                  {language === 'ta' ? 'நோயாளி போர்டல்' : 'Patient Portal'}
                </p>
                <h3 className="text-sm font-bold text-slate-800 truncate">{user?.full_name}</h3>
                <p className="text-[11px] text-slate-500 truncate">{user?.phone_number}</p>
              </div>
            </div>

            {/* Navigation Menu */}
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
                        ? 'bg-teal-600 text-white shadow-sm'
                        : link.highlight
                        ? 'text-rose-600 bg-rose-50/80 hover:bg-rose-100 font-bold'
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : link.highlight ? 'text-rose-600' : 'text-teal-600'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-teal-800">RuralCare</span>
            <span>– {language === 'ta' ? 'அனைவருக்குமான கிராமப்புற மருத்துவ சேவை' : 'Healthcare Within Everyone’s Reach'}</span>
          </div>
          <div className="flex items-center gap-6">
            <span>ABDM Sandbox Mode</span>
            <span>Emergency Helpline: <strong className="text-rose-600">112 / 108</strong></span>
            <span>Tamil Nadu Rural Health Initiative</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

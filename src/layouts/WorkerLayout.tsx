import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  Home,
  Users,
  Clock,
  Tent,
  Share2,
  RefreshCw,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { Header } from '../components/navigation/Header';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const WorkerLayout: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/worker/dashboard', label: language === 'ta' ? 'களப்பணியாளர் முகப்பு' : 'Worker Dashboard', icon: HeartHandshake },
    { to: '/worker/visits', label: language === 'ta' ? 'வீட்டுச் சந்திப்புகள்' : 'Home Visits', icon: Home },
    { to: '/followups', label: language === 'ta' ? 'தொடர் கண்காணிப்பு' : 'Follow-up Tasks', icon: Clock },
    { to: '/worker/register-patient', label: language === 'ta' ? 'புதிய நோயாளி பதிவு' : 'Register Patient', icon: UserPlus },
    { to: '/health-camps', label: language === 'ta' ? 'மருத்துவ முகாம்கள்' : 'Health Camps', icon: Tent },
    { to: '/referrals', label: language === 'ta' ? 'பரிந்துரை கண்காணிப்பு' : 'Referral Tracking', icon: Share2 },
    { to: '/emergency', label: language === 'ta' ? 'அவசர உதவி ஆதரவு' : 'Emergency Help', icon: ShieldAlert, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <OfflineBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        {/* Worker Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 sticky top-24 space-y-4">
            {/* ASHA Badge Card */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    {language === 'ta' ? 'ஆஷா களப்பணியாளர்' : 'ASHA Health Worker'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 truncate">{user?.full_name}</h3>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-600 border-t border-amber-100 flex justify-between">
                <span>{language === 'ta' ? 'ஒதுக்கீடு:' : 'Village:'}</span>
                <strong className="text-slate-800">Alanganallur (Ward 2)</strong>
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
                        ? 'bg-amber-600 text-white shadow-sm'
                        : link.highlight
                        ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold'
                        : 'text-slate-600 hover:text-amber-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : link.highlight ? 'text-rose-600' : 'text-amber-600'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Worker Main Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  PhoneCall,
  Mic,
  Globe,
  Type,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  Building2,
  Calendar,
  Pill,
  Clock,
  Share2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserRole } from '../../types';
import { VoiceAssistantModal } from '../../features/voice-assistant/VoiceAssistantModal';

export const Header: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { language, toggleLanguage, isAccessibleText, toggleAccessibleText } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { ta: string; en: string; color: string }> = {
    patient: { ta: 'நோயாளி (Patient)', en: 'Patient', color: 'bg-emerald-100 text-emerald-800' },
    doctor: { ta: 'மருத்துவர் (Doctor)', en: 'Doctor', color: 'bg-blue-100 text-blue-800' },
    health_worker: { ta: 'ஆஷா பணியாளர் (ASHA)', en: 'ASHA Worker', color: 'bg-amber-100 text-amber-800' },
    caregiver: { ta: 'பராமரிப்பாளர் (Caregiver)', en: 'Caregiver', color: 'bg-purple-100 text-purple-800' },
    facility_admin: { ta: 'PHC நிர்வாகி (Admin)', en: 'PHC Admin', color: 'bg-teal-100 text-teal-800' },
    super_admin: { ta: 'மாநில நிர்வாகி (Super Admin)', en: 'Super Admin', color: 'bg-rose-100 text-rose-800' },
  };

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setIsRoleDropdownOpen(false);
    setIsMobileMenuOpen(false);

    // Navigate to role-specific dashboard
    if (newRole === 'doctor') navigate('/doctor/dashboard');
    else if (newRole === 'health_worker') navigate('/worker/dashboard');
    else if (newRole === 'facility_admin' || newRole === 'super_admin') navigate('/admin/dashboard');
    else navigate('/patient/dashboard');
  };

  const navLinks = [
    { to: '/facilities', label: language === 'ta' ? 'மருத்துவமனைகள்' : 'Facilities', icon: Building2 },
    { to: '/appointments', label: language === 'ta' ? 'முன்பதிவு' : 'Appointments', icon: Calendar },
    { to: '/medications', label: language === 'ta' ? 'மருந்துகள்' : 'Medications', icon: Pill },
    { to: '/followups', label: language === 'ta' ? 'தொடர் கண்காணிப்பு' : 'Follow-ups', icon: Clock },
    { to: '/referrals', label: language === 'ta' ? 'பரிந்துரைகள்' : 'Referrals', icon: Share2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        {/* Top Announcement & Emergency Bar */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white px-4 py-1 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {language === 'ta'
                ? 'அரசு ஆரம்ப சுகாதார நிலையங்கள் & ஆஷா களப்பணி ஒருங்கிணைப்பு'
                : 'National Rural Health Mission Support Platform'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/emergency"
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-0.5 rounded-full text-xs font-bold transition shadow-sm animate-pulse"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{language === 'ta' ? 'அவசர எண் 112 / 108' : 'Emergency 112 / 108'}</span>
            </Link>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-teal-800">RuralCare</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                  {language === 'ta' ? 'ரூரல்கேர்' : 'v1.0'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                {language === 'ta' ? 'அனைவருக்குமான கிராமப்புற மருத்துவ சேவை' : 'Healthcare Within Everyone’s Reach'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & Switchers */}
          <div className="flex items-center gap-2">
            {/* AI Voice Assistant Trigger */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
              title="Open RuralCare AI Voice Assistant"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden md:inline">
                {language === 'ta' ? 'குரல் உதவியாளர்' : 'Voice Assistant'}
              </span>
            </button>

            {/* Accessibility Font Size Toggle */}
            <button
              onClick={toggleAccessibleText}
              className={`p-2 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
                isAccessibleText
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title={language === 'ta' ? 'பெரிய எழுத்துரு முறை' : 'Toggle Large Font Accessibility'}
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">{isAccessibleText ? 'A+ (On)' : 'A'}</span>
            </button>

            {/* Language Toggle (Tamil / English) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition"
              title="Switch Language / மொழியை மாற்றுக"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  roleLabels[role].color
                } border-slate-300`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="max-w-[110px] sm:max-w-none truncate">
                  {language === 'ta' ? roleLabels[role].ta : roleLabels[role].en}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                    {language === 'ta' ? 'டெமோ பாத்திரத்தை மாற்றுக:' : 'Switch Role (Instant Demo):'}
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition hover:bg-teal-50 ${
                        role === r ? 'bg-teal-50/80 font-bold text-teal-800' : 'text-slate-700'
                      }`}
                    >
                      <span>{language === 'ta' ? roleLabels[r].ta : roleLabels[r].en}</span>
                      {role === r && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3">
                    <button
                      onClick={logout}
                      className="w-full text-left py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  <Icon className="w-5 h-5 text-teal-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/emergency"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-rose-600 bg-rose-50"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>{language === 'ta' ? 'அவசர உதவி (112 / 108)' : 'Emergency Assistance (112)'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </>
  );
};

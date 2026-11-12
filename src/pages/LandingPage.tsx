import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Building2,
  Calendar,
  Pill,
  Clock,
  Mic,
  ShieldAlert,
  Users,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Sparkles,
  CreditCard,
  Tent,
} from 'lucide-react';
import { Header } from '../components/navigation/Header';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { language } = useLanguage();
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'health_worker') navigate('/worker/dashboard');
    else if (role === 'facility_admin' || role === 'super_admin') navigate('/admin/dashboard');
    else navigate('/patient/dashboard');
  };

  const features = [
    {
      icon: Building2,
      title: language === 'ta' ? 'கிராமப்புற சுகாதார மையங்கள்' : 'Primary Health Centre Finder',
      desc: language === 'ta'
        ? 'OpenStreetMap வரைபடத்தில் உங்கள் அருகிலுள்ள PHC, தாலுகா மருத்துவமனை மற்றும் மருந்தகங்களை எளிதாக கண்டறியுங்கள்.'
        : 'Locate verified Primary Health Centres, Sub-centres, and rural pharmacies with directions and operating hours.',
      link: '/facilities',
      color: 'bg-teal-50 text-teal-700',
    },
    {
      icon: Clock,
      title: language === 'ta' ? 'ஸ்மார்ட் தொடர் கண்காணிப்பு' : 'Smart Patient Follow-Up',
      desc: language === 'ta'
        ? 'மருத்துவரின் ஆலோசனைக்கு பின் ஆஷா களப்பணியாளர் வீட்டுக்கு நேரில் வந்து பரிசோதனை செய்யும் ஒருங்கிணைப்பு.'
        : 'Rules-based clinical follow-up planning with scheduled ASHA field visits and overdue escalation alerts.',
      link: '/followups',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      icon: Mic,
      title: language === 'ta' ? 'ரூரல்கேர் குரல் உதவியாளர்' : 'Tamil & English Voice Assistant',
      desc: language === 'ta'
        ? 'எழுத்தறிவு குறைந்த மற்றும் முதியோருக்காக தமிழில் பேசிக் கேட்கும் AI குரல் வழிகாட்டி.'
        : 'Hands-free voice recognition in Tamil and English with text fallback and spoken audio responses.',
      link: '/patient/dashboard',
      color: 'bg-sky-50 text-sky-700',
    },
    {
      icon: Pill,
      title: language === 'ta' ? 'மருந்து நினைவூட்டல்' : 'Medication Reminders',
      desc: language === 'ta'
        ? 'தினசரி மாத்திரைகள் உட்கொள்ள நினைவூட்டல் மற்றும் உட்கொண்டதை பதியும் எளிய இடைமுகம்.'
        : 'Daily dose alerts, audio prompts, and adherence tracking for chronic hypertension and diabetes patients.',
      link: '/medications',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: WifiOff,
      title: language === 'ta' ? 'ஆஃப்லைன் IndexedDB வசதி' : 'Offline-First Architecture',
      desc: language === 'ta'
        ? 'இணையம் இல்லாத தொலைதூர கிராமங்களிலும் ஆஷா பணியாளர்கள் பதிவுகளை சேமித்து பின்னர் ஒத்திசைக்கலாம்.'
        : 'PWA service worker caching and secure IndexedDB storage for offline home visit logging in low-connectivity hamlets.',
      link: '/worker/dashboard',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      icon: CreditCard,
      title: language === 'ta' ? 'ஆயுஷ்மான் பாரத் (ABDM)' : 'Ayushman Bharat (ABDM) Ready',
      desc: language === 'ta'
        ? '14 இலக்க ABHA அடையாள அட்டை மற்றும் ஒப்புதல் அடிப்படையிலான சுகாதார தரவு பரிமாற்றம்.'
        : 'Modular sandbox layer for 14-digit ABHA linking, consent management, and electronic health record exchange.',
      link: '/profile',
      color: 'bg-rose-50 text-rose-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <OfflineBanner />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'ta'
                  ? 'கிராமப்புற மக்களுக்கான பிரத்யேக மருத்துவ இணைப்பு தளம்'
                  : 'Bridging the Healthcare Gap in Rural Communities'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {language === 'ta' ? (
                <>
                  அனைவருக்குமான <span className="text-teal-600">கிராமப்புற</span> மருத்துவ சேவை.
                </>
              ) : (
                <>
                  Healthcare Within <span className="text-teal-600">Everyone’s</span> Reach.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {language === 'ta'
                ? 'நோயாளி, மருத்துவர், ஆரம்ப சுகாதார நிலையம், ஆஷா களப்பணியாளர் மற்றும் குடும்ப பராமரிப்பாளர்களை இணைக்கும் ஒற்றை ஒருங்கிணைந்த மருத்துவ தளம்.'
                : 'Connecting patients, doctors, hospitals, community health workers, and family caregivers across rural villages through one responsive, offline-ready healthcare platform.'}
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/facilities"
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-teal-100 transition flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>{language === 'ta' ? 'அருகிலுள்ள PHC-ஐ கண்டறி' : 'Find Nearby Facility'}</span>
              </Link>

              <Link
                to="/appointments"
                className="px-6 py-3.5 bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 rounded-2xl text-sm font-bold shadow-sm transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>{language === 'ta' ? 'முன்பதிவு செய்க' : 'Book Appointment'}</span>
              </Link>

              <Link
                to="/emergency"
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-extrabold shadow-md hover:shadow-rose-100 transition flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{language === 'ta' ? 'அவசர உதவி 112 / 108' : 'Emergency 112'}</span>
              </Link>
            </div>

            {/* Instant Role Access Bar */}
            <div className="pt-8 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {language === 'ta' ? 'விரைவு டெமோ உள்நுழைவு (ஒரே கிளிக்கில் சோதிக்க):' : 'Explore Roles (Instant 1-Click Demo):'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  <button
                    onClick={() => handleQuickDemoLogin('patient')}
                    className="p-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition"
                  >
                    👤 {language === 'ta' ? 'நோயாளி' : 'Patient'}
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('doctor')}
                    className="p-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition"
                  >
                    🩺 {language === 'ta' ? 'மருத்துவர்' : 'Doctor'}
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('health_worker')}
                    className="p-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition"
                  >
                    🤝 {language === 'ta' ? 'ஆஷா பணியாளர்' : 'ASHA Worker'}
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('facility_admin')}
                    className="p-2 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition"
                  >
                    🛡️ {language === 'ta' ? 'நிர்வாகி' : 'Admin'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Pillars Feature Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'ta'
                ? 'கிராமப்புற சுகாதாரத்தை மாற்றியமைக்கும் அம்சங்கள்'
                : 'Built Specifically for Rural Community Realities'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              {language === 'ta'
                ? 'நேரடி இணையம் இல்லாத போதும் இயங்கும் திறன், எளிய தமிழ் குரல் வழிநடத்துதல் மற்றும் ஆஷா பணியாளர் ஆதரவு.'
                : 'Designed for accessibility, senior citizens, non-digital natives, and field healthcare workers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={idx}
                  to={feat.link}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-teal-300 hover:bg-white transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center font-bold`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs font-bold text-teal-700 group-hover:gap-2 transition-all">
                    <span>{language === 'ta' ? 'மேலும் காண்க' : 'Open Module'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-auto border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-base tracking-tight">RuralCare</span>
                <p className="text-[11px] text-slate-400">Healthcare Within Everyone’s Reach</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <Link to="/facilities" className="hover:text-teal-400">Facilities</Link>
              <Link to="/appointments" className="hover:text-teal-400">Appointments</Link>
              <Link to="/emergency" className="hover:text-teal-400 text-rose-400 font-bold">Emergency 112</Link>
              <Link to="/profile" className="hover:text-teal-400">ABDM Sandbox</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-slate-500 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>© 2026 RuralCare Tamil Nadu Rural Health Coordination Initiative.</span>
            <span>Emergency 112 / 108 Ambulance Hotline. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

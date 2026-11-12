import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  HeartHandshake,
  Users,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('muthuvel.patient@ruralcare.demo');
  const [password, setPassword] = useState('demo1234');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleDemos: { role: UserRole; name: string; email: string; icon: any }[] = [
    { role: 'patient', name: 'Muthuvel (Patient)', email: 'muthuvel.patient@ruralcare.demo', icon: User },
    { role: 'doctor', name: 'Dr. Sundaram (Doctor)', email: 'dr.sundaram@ruralcare.demo', icon: Stethoscope },
    { role: 'health_worker', name: 'Kavitha (ASHA)', email: 'kavitha.asha@ruralcare.demo', icon: HeartHandshake },
    { role: 'facility_admin', name: 'PHC Administrator', email: 'admin.phc@ruralcare.demo', icon: ShieldCheck },
  ];

  const handleQuickSelect = (demo: typeof roleDemos[0]) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await login(email, selectedRole);
    setIsSubmitting(false);

    if (selectedRole === 'doctor') navigate('/doctor/dashboard');
    else if (selectedRole === 'health_worker') navigate('/worker/dashboard');
    else if (selectedRole === 'facility_admin' || selectedRole === 'super_admin') navigate('/admin/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 to-sky-800 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-2 shadow-inner">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black">RuralCare</h1>
          <p className="text-xs text-teal-100">
            {language === 'ta' ? 'அனைவருக்குமான கிராமப்புற மருத்துவ சேவை' : 'Healthcare Within Everyone’s Reach'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'பாத்திரத்தை தேர்வு செய்யவும்:' : 'Select Your Account Role:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleDemos.map((d) => {
                const Icon = d.icon;
                const isSelected = selectedRole === d.role;
                return (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => handleQuickSelect(d)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition text-left ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-teal-600" />
                    <span className="truncate">{d.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்:' : 'Email / Mobile Phone Number:'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                {language === 'ta' ? 'கடவுச்சொல்:' : 'Password:'}
              </label>
              <span className="text-[11px] text-teal-700 cursor-pointer">
                {language === 'ta' ? 'மறந்துவிட்டதா?' : 'Forgot password?'}
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-teal-100"
          >
            <span>{isSubmitting ? 'Authenticating...' : language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>{language === 'ta' ? 'கணக்கு இல்லையா?' : 'Don’t have an account yet?'} </span>
            <Link to="/register" className="font-bold text-teal-700 hover:text-teal-800">
              {language === 'ta' ? 'இப்போதே பதிவு செய்க' : 'Register Here'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

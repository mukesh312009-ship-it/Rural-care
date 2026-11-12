import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [village, setVillage] = useState('Alanganallur');
  const [medicalRegNo, setMedicalRegNo] = useState('');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    await register({
      full_name: fullName,
      phone_number: phoneNumber,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@ruralcare.demo`,
      role,
    });
    setIsSubmitting(false);

    if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'health_worker') navigate('/worker/dashboard');
    else if (role === 'facility_admin') navigate('/admin/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 to-sky-800 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-2 shadow-inner">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black">
            {language === 'ta' ? 'ரூரல்கேரில் புதிய கணக்கு பதிவு' : 'Create RuralCare Account'}
          </h1>
          <p className="text-xs text-teal-100">
            {language === 'ta' ? 'கிராமப்புற சுகாதார வசதிகளை உடனடியாக அணுக' : 'Unified Health Platform Registration'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'உங்கள் பங்கு (Role):' : 'Account Type:'}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
            >
              <option value="patient">Patient (நோயாளி)</option>
              <option value="doctor">Doctor (மருத்துவர்)</option>
              <option value="health_worker">Community Health Worker (ஆஷா பணியாளர்)</option>
              <option value="caregiver">Family Caregiver (குடும்ப பராமரிப்பாளர்)</option>
              <option value="facility_admin">Facility Administrator (PHC நிர்வாகி)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'முழு பெயர்:' : 'Full Name:'}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Meenakshi Sundaram"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number:</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village / Ward:</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          {role === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Medical Council Registration Number (MCI/TNMC):
              </label>
              <input
                type="text"
                value={medicalRegNo}
                onChange={(e) => setMedicalRegNo(e.target.value)}
                placeholder="TNMC-2022-XXXXX"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@ruralcare.org"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <label className="flex items-center gap-2 pt-1 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
              required
            />
            <span>
              {language === 'ta'
                ? 'ரூரல்கேர் விதிமுறைகள் மற்றும் சுகாதார தரவு பாதுகாப்பு கொள்கைகளை ஏற்கிறேன்.'
                : 'I accept RuralCare Terms and data privacy policies.'}
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !consent}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-teal-100"
          >
            <span>{isSubmitting ? 'Creating Profile...' : language === 'ta' ? 'பதிவு செய்க' : 'Register Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>{language === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'} </span>
            <Link to="/login" className="font-bold text-teal-700 hover:text-teal-800">
              {language === 'ta' ? 'உள்நுழைக' : 'Sign In'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

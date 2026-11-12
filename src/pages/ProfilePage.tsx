import React, { useState } from 'react';
import {
  User,
  Heart,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Save,
  ShieldCheck,
  CreditCard,
  Link2,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { Patient } from '../types';

export const ProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const { user, updateProfile } = useAuth();

  const [patient, setPatient] = useState<Patient>(() => dataService.getPatient());
  const [fullName, setFullName] = useState(patient.profile?.full_name || 'Muthuvel Karuppan');
  const [age, setAge] = useState(String(patient.age));
  const [gender, setGender] = useState(patient.gender);
  const [phoneNumber, setPhoneNumber] = useState(patient.profile?.phone_number || '+91 98421 11201');
  const [address, setAddress] = useState(patient.address);
  const [village, setVillage] = useState(patient.village);
  const [district, setDistrict] = useState(patient.district);
  const [emergencyContactName, setEmergencyContactName] = useState(patient.emergency_contact_name);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(patient.emergency_contact_phone);
  const [bloodGroup, setBloodGroup] = useState(patient.blood_group || 'O+');
  const [knownAllergies, setKnownAllergies] = useState(patient.known_allergies || '');
  const [existingConditions, setExistingConditions] = useState(patient.existing_conditions || '');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(patient.accessibility_needs || '');

  // ABDM Sandbox State
  const [abhaId, setAbhaId] = useState(patient.abha_id || '91-4458-1290-7812');
  const [abhaLinked, setAbhaLinked] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = dataService.updatePatient({
      age: Number(age),
      gender: gender as any,
      address,
      village,
      district,
      emergency_contact_name: emergencyContactName,
      emergency_contact_phone: emergencyContactPhone,
      blood_group: bloodGroup,
      known_allergies: knownAllergies,
      existing_conditions: existingConditions,
      accessibility_needs: accessibilityNeeds,
    });

    updateProfile({ full_name: fullName, phone_number: phoneNumber });
    setPatient(updated);

    setToastMessage(
      language === 'ta'
        ? 'சுயவிவரம் மற்றும் மருத்துவ தகவல்கள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன!'
        : 'Profile and health credentials updated successfully!'
    );
    setTimeout(() => setToastMessage(null), 3500);
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
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'நோயாளி மருத்துவ சுயவிவரம்' : 'Patient Health Profile'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'உங்கள் உடல்நல தகவல்கள், அவசர தொடர்பு மற்றும் ஆயுஷ்மான் பாரத் (ABHA) விவரங்கள்.'
                  : 'Manage demographic information, clinical history, and Ayushman Bharat health account.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ABDM Sandbox Card */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 p-6 rounded-3xl text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Ayushman Bharat Digital Mission (ABDM) Sandbox
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-slate-900">
            {abhaLinked ? 'ABHA Linked (சரிபார்க்கப்பட்டது)' : 'Not Linked'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-2xl font-black tracking-widest font-mono text-teal-50">{abhaId}</div>
            <p className="text-xs text-teal-100 mt-0.5">ABHA Address: muthuvel@abdm.sbx</p>
          </div>
          <div className="text-xs text-teal-200 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            🔒 Sandbox Consent Layer: Fast Electronic Health Record (EHR) Exchange Ready
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Personal Details */}
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
            {language === 'ta' ? '1. அடிப்படை தனிநபர் விவரங்கள்' : '1. Personal Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="male">Male (ஆண்)</option>
                <option value="female">Female (பெண்)</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Village Address */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
            {language === 'ta' ? '2. முகவரி மற்றும் தொடர்பு விவரங்கள்' : '2. Contact & Location'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Village:</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District:</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">Door / Street Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
            {language === 'ta' ? '3. அவசர கால தொடர்பு நபர்' : '3. Emergency Contact Details'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Name & Relation:</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Phone Number:</label>
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        {/* Clinical Health Records */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
            {language === 'ta' ? '4. மருத்துவ நலம் மற்றும் ஒவ்வாமை' : '4. Clinical Profile & Allergies'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Known Allergies:</label>
              <input
                type="text"
                value={knownAllergies}
                onChange={(e) => setKnownAllergies(e.target.value)}
                placeholder="e.g. Sulfa drugs, penicillin..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Existing Conditions:</label>
              <input
                type="text"
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
                placeholder="e.g. Type 2 Diabetes, Mild Hypertension..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Accessibility or Assistance Needs:
            </label>
            <input
              type="text"
              value={accessibilityNeeds}
              onChange={(e) => setAccessibilityNeeds(e.target.value)}
              placeholder="e.g. Needs large print, Tamil audio assistance, wheelchair mobility support..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md hover:shadow-teal-100"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'ta' ? 'சுயவிவரத்தை சேமி' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

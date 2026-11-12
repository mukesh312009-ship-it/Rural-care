import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
  Calendar,
  Pill,
  Clock,
  FileText,
  Lock,
  Heart,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { CaregiverPermission } from '../types';

export const CaregiverPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const [permissions, setPermissions] = useState<CaregiverPermission[]>(() =>
    dataService.getCaregiverPermissions()
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite Form
  const [caregiverName, setCaregiverName] = useState('');
  const [phone, setPhone] = useState('+91 9');
  const [relationship, setRelationship] = useState('Daughter (மகள்)');

  const handleTogglePermission = (
    id: string,
    field: keyof Omit<CaregiverPermission, 'id' | 'patient_id' | 'caregiver_id'>
  ) => {
    const perm = permissions.find((p) => p.id === id);
    if (perm) {
      const updated = dataService.updateCaregiverPermission(id, {
        [field]: !perm[field],
      });
      setPermissions([...dataService.getCaregiverPermissions()]);
      showToast(
        language === 'ta'
          ? 'பராமரிப்பாளர் அணுகல் உரிமை புதுப்பிக்கப்பட்டது!'
          : 'Caregiver permission scope updated!'
      );
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName.trim()) return;

    showToast(
      language === 'ta'
        ? `குடும்ப பராமரிப்பாளர் ${caregiverName} சேர்க்கப்பட்டார்!`
        : `Family Caregiver invitation sent to ${caregiverName}!`
    );
    setIsInviteModalOpen(false);
    setCaregiverName('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'குடும்ப பராமரிப்பாளர் அனுமதி மேலாண்மை' : 'Family Caregiver Access'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'வயதான பெற்றோர்கள் அல்லது குடும்ப உறுப்பினர்களுக்கு உதவ குறிப்பிட்ட அனுமதிகளை வழங்குதல்.'
                  : 'Authorize trusted family members with strictly scoped healthcare permissions.'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md hover:shadow-purple-100"
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'ta' ? 'பராமரிப்பாளரை இணைக்க' : 'Authorize Family Member'}</span>
        </button>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-purple-900 text-xs flex items-start gap-3">
        <Lock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">
            {language === 'ta' ? 'நோயாளி தனியுரிமை பாதுகாப்பு விதிமுறை:' : 'Patient Privacy Protection:'}
          </strong>
          {language === 'ta'
            ? 'பராமரிப்பாளர்களுக்கு முழுமையான மருத்துவ வரலாறுகள் வழங்கப்படுவதில்லை. நீங்கள் தேர்ந்தெடுத்த முன்பதிவு மற்றும் மருந்து நினைவூட்டல்கள் மட்டுமே காட்டப்படும்.'
            : 'Caregivers never receive unrestricted access to sensitive clinical histories. You control exact permissions per family member.'}
        </div>
      </div>

      {/* Caregivers Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{perm.caregiver_name}</h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ta' ? 'உதவி பெறும் நோயாளி:' : 'Patient:'}{' '}
                    <strong>{perm.patient_name}</strong>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {language === 'ta' ? 'செயலில் உள்ளது' : 'Active'}
              </span>
            </div>

            {/* Granular Permission Toggles */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>{language === 'ta' ? 'முன்பதிவுகளைப் பார்க்க' : 'View Appointments'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={perm.can_view_appointments}
                  onChange={() => handleTogglePermission(perm.id, 'can_view_appointments')}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>{language === 'ta' ? 'முன்பதிவு செய்ய உதவ' : 'Book Appointments on Behalf'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={perm.can_book_appointments}
                  onChange={() => handleTogglePermission(perm.id, 'can_book_appointments')}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>{language === 'ta' ? 'மருந்து நினைவூட்டல்களைப் பார்க்க' : 'View Medication Reminders'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={perm.can_view_medications}
                  onChange={() => handleTogglePermission(perm.id, 'can_view_medications')}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ta' ? 'தொடர் கண்காணிப்பு தகவல்கள்' : 'View Follow-Up Status'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={perm.can_view_followups}
                  onChange={() => handleTogglePermission(perm.id, 'can_view_followups')}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 opacity-70">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>{language === 'ta' ? 'முழுமையான மருத்துவ ஆவணங்கள் (கட்டுப்படுத்தப்பட்டது)' : 'Full Clinical Records (Restricted)'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={perm.can_view_health_records}
                  onChange={() => handleTogglePermission(perm.id, 'can_view_health_records')}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-purple-700 to-purple-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'குடும்ப பராமரிப்பாளரை அங்கீகரித்தல்' : 'Authorize Family Member'}
                </h2>
                <p className="text-xs text-purple-100">
                  {language === 'ta' ? 'நம்பகமான உறுப்பினருக்கு அனுமதி வழங்குதல்' : 'Assign assistance permissions'}
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'பராமரிப்பாளர் பெயர்:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Selvi Muthuvel"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'உறவுமுறை:' : 'Relationship:'}
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Daughter">Daughter (மகள்)</option>
                  <option value="Son">Son (மகன்)</option>
                  <option value="Spouse">Spouse (மனைவி/கணவர்)</option>
                  <option value="Sibling">Sibling (சகோதரன்/சகோதரி)</option>
                  <option value="Guardian">Guardian (பாதுகாவலர்)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {language === 'ta' ? 'அனுமதியை உறுதி செய்' : 'Grant Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

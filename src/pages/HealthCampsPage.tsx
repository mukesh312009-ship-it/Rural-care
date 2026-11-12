import React, { useState } from 'react';
import {
  Tent,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  PlusCircle,
  Stethoscope,
  Send,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { HealthCamp } from '../types';

export const HealthCampsPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const [camps, setCamps] = useState<HealthCamp[]>(() => dataService.getHealthCamps());
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<HealthCamp | null>(null);
  const [attendeeName, setAttendeeName] = useState(user?.full_name || 'Muthuvel Karuppan');
  const [phone, setPhone] = useState(user?.phone_number || '+91 98421 11201');
  const [village, setVillage] = useState('Alanganallur');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCamp) return;

    dataService.registerForCamp(selectedCamp.id, attendeeName, phone, village);
    setCamps([...dataService.getHealthCamps()]);
    setIsRegisterModalOpen(false);
    showToast(
      language === 'ta'
        ? `மருத்துவ முகாமில் ${attendeeName} வெற்றிகரமாக பதிவு செய்யப்பட்டார்!`
        : `Registration confirmed for ${attendeeName} at health camp!`
    );
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
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Tent className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'கிராமப்புற மருத்துவ முகாம்கள்' : 'Rural Health Camps'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'இலவச பொது மருத்துவ பரிசோதனை, ரத்த அழுத்தம், சர்க்கரை மற்றும் கண் சிகிச்சை முகாம்கள்.'
                  : 'Community screening camps, preventive healthcare drives, and free generic drug distribution.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Camps List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {camps.map((camp) => (
          <div
            key={camp.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  {camp.status}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <strong>{camp.attendees_count}</strong> {language === 'ta' ? 'பதிவுகள்' : 'Registered'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{camp.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{camp.location_venue}, {camp.village}</span>
                </p>
              </div>

              {/* Date & Time */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold">{camp.camp_date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>{camp.start_time} - {camp.end_time}</span>
                </div>
                {camp.lead_doctor_name && (
                  <div className="flex items-center gap-1.5 text-teal-800 font-medium">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>{camp.lead_doctor_name}</span>
                  </div>
                )}
              </div>

              {/* Services Offered */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {language === 'ta' ? 'முகாமில் கிடைக்கும் சேவைகள்:' : 'Services Offered:'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {camp.services_offered.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-teal-50 border border-teal-200 text-teal-800 px-2.5 py-1 rounded-lg font-medium"
                    >
                      ✓ {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {language === 'ta' ? 'அனைத்து கிராம மக்களுக்கும் இலவசம்' : 'Free for all villagers'}
              </span>

              <button
                onClick={() => {
                  setSelectedCamp(camp);
                  setIsRegisterModalOpen(true);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'முகாமில் பதிவு செய்' : 'Register for Camp'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Register Modal */}
      {isRegisterModalOpen && selectedCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'மருத்துவ முகாம் முன்பதிவு' : 'Health Camp Registration'}
                </h2>
                <p className="text-xs text-teal-100">{selectedCamp.title}</p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'பங்கேற்பாளர் பெயர்:' : 'Participant Name:'}
                </label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
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

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  {language === 'ta' ? 'பதிவை உறுதி செய்' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

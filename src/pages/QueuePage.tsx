import React, { useState } from 'react';
import {
  ListOrdered,
  Clock,
  User,
  Building2,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Volume2,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { QueueToken } from '../types';

export const QueuePage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const facilities = dataService.getFacilities();
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilities[0]?.id || '');
  const [tokens, setTokens] = useState<QueueToken[]>(() =>
    dataService.getQueueTokens(selectedFacilityId)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCalled = tokens.find((t) => t.status === 'Called' || t.status === 'In Consultation');
  const myToken = tokens.find((t) => t.patient_name?.includes('Muthuvel'));

  const handleGenerateToken = () => {
    const newToken = dataService.generateQueueToken(
      selectedFacilityId,
      'c0000001-0000-0000-0000-000000000001',
      user?.full_name || 'Muthuvel Karuppan'
    );
    setTokens(dataService.getQueueTokens(selectedFacilityId));
    showToast(
      language === 'ta'
        ? `புதிய OPD டோக்கன் உருவாக்கப்பட்டது: ${newToken.token_code}`
        : `New OPD queue token issued: ${newToken.token_code}`
    );
  };

  const handleAdvanceQueue = (status: 'Called' | 'Completed') => {
    const waitingToken = tokens.find((t) => t.status === 'Waiting');
    if (!waitingToken) return;

    dataService.advanceQueueToken(waitingToken.id, status);
    setTokens(dataService.getQueueTokens(selectedFacilityId));
    showToast(
      language === 'ta'
        ? `டோக்கன் ${waitingToken.token_code} அழைக்கப்பட்டது!`
        : `Token ${waitingToken.token_code} called for consultation!`
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
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
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'ஸ்மார்ட் OPD டோக்கன் வரிசை' : 'Smart OPD Queue Management'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'நேரடி மருத்துவமனை வரிசை நிலை, தற்போதைய டோக்கன் மற்றும் காத்திருப்பு நேரம்.'
                  : 'Live outpatient clinic token queue, calling display, and estimated wait duration.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {role === 'doctor' && (
            <button
              onClick={() => handleAdvanceQueue('Called')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'அடுத்த டோக்கனை அழைக்க' : 'Call Next Token'}</span>
            </button>
          )}

          <button
            onClick={handleGenerateToken}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய டோக்கன் பெறுக' : 'Get Queue Token'}</span>
          </button>
        </div>
      </div>

      {/* Big Display Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currently Consulting Token */}
        <div className="bg-gradient-to-br from-teal-800 to-teal-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              {language === 'ta' ? 'தற்போது ஆலோசனையில் உள்ள டோக்கன்' : 'Now Serving in OPD Room 1'}
            </span>
            <div className="text-5xl font-black mt-2 text-teal-100">
              {currentCalled ? currentCalled.token_code : 'PHC-OPD-012'}
            </div>
            <p className="text-xs text-teal-200 mt-2 flex items-center gap-1">
              <Stethoscope className="w-4 h-4" />
              <span>Dr. Sundaram Senthil, MD (General Medicine)</span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-teal-700 flex items-center justify-between text-xs text-teal-200">
            <span>Alanganallur Primary Health Centre</span>
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Queue Active
            </span>
          </div>
        </div>

        {/* Patient's My Token Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'ta' ? 'உங்கள் டோக்கன் நிலை' : 'Your Token Position'}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl font-black text-teal-700">
                {myToken ? myToken.token_code : 'PHC-OPD-014'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Waiting (வரிசையில்)
              </span>
            </div>

            <div className="mt-4 p-3 bg-teal-50 rounded-2xl border border-teal-100 space-y-1 text-xs text-teal-900">
              <div className="flex items-center justify-between font-bold">
                <span>{language === 'ta' ? 'உங்களுக்கு முன் உள்ளவர்கள்:' : 'Patients Ahead of You:'}</span>
                <span>2 {language === 'ta' ? 'நோயாளிகள்' : 'Patients'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{language === 'ta' ? 'தோராய காத்திருப்பு நேரம்:' : 'Estimated Wait Time:'}</span>
                <span className="font-semibold text-teal-700">~15 - 20 mins</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            {language === 'ta'
              ? 'உங்கள் எண் அழைக்கப்படும் போது ஒலிபெருக்கியில் அறிவிக்கப்படும்.'
              : 'Live audio announcement will play when your token is called.'}
          </p>
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          {language === 'ta' ? 'இன்றைய OPD டோக்கன் பட்டியல்' : 'Today’s Patient Queue'}
        </h3>
        <div className="space-y-2">
          {tokens.map((tok) => (
            <div
              key={tok.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                tok.status === 'Called'
                  ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                  {tok.token_number}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{tok.patient_name}</h4>
                  <p className="text-xs text-slate-500">{tok.token_code}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tok.status === 'Called'
                    ? 'bg-blue-600 text-white'
                    : tok.status === 'Completed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tok.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

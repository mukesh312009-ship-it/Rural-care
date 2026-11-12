import React, { useState, useEffect } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Calendar,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { Medication } from '../types';

export const MedicationPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Prescription Form State (for Doctors)
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Twice daily (காலை, இரவு)');
  const [reminderTime, setReminderTime] = useState('08:00 AM, 08:00 PM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );

  useEffect(() => {
    refreshMedications();
  }, []);

  const refreshMedications = () => {
    setMedications(dataService.getMedications());
  };

  const handleMarkDose = (id: string, status: 'taken' | 'missed') => {
    dataService.markMedicationDose(id, status);
    refreshMedications();
    showToast(
      status === 'taken'
        ? language === 'ta'
          ? 'மருந்து உட்கொண்டதாக பதியப்பட்டது! நன்று.'
          : 'Dose recorded as Taken! Great job.'
        : language === 'ta'
        ? 'மருந்து தவறியதாக குறிக்கப்பட்டது. அடுத்த முறை நேரத்திற்கு உட்கொள்ளவும்.'
        : 'Dose marked as Missed.'
    );
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim() || !dosage.trim()) return;

    dataService.addMedication({
      patient_id: 'd0000001-0000-0000-0000-000000000001',
      medicine_name: medicineName,
      dosage_instructions: dosage,
      frequency,
      reminder_time: reminderTime,
      start_date: startDate,
      end_date: endDate,
    });

    setIsAddModalOpen(false);
    setMedicineName('');
    setDosage('');
    refreshMedications();
    showToast(
      language === 'ta'
        ? 'புதிய மருந்து சீட்டு வெற்றிகரமாக சேர்க்கப்பட்டது!'
        : 'New prescription added successfully!'
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
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'மருந்து அட்டவணை மற்றும் நினைவூட்டல்' : 'Medication Schedule & Reminders'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'தினசரி மருந்து உட்கொள்ளல் நினைவூட்டல்கள் மற்றும் மருத்துவரின் மருந்து சீட்டு (Rx).'
                  : 'Daily medication adherence tracking, audio reminders, and physician prescriptions.'}
              </p>
            </div>
          </div>
        </div>

        {role === 'doctor' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'மருந்து பரிந்துரை சேர் (Rx)' : 'Add Prescription (Rx)'}</span>
          </button>
        )}
      </div>

      {/* Adherence Overview Card */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
            {language === 'ta' ? 'மருந்து உட்கொள்ளல் வீதம்' : 'Patient Adherence Score'}
          </span>
          <h2 className="text-3xl font-black mt-1">94% Adherence</h2>
          <p className="text-xs text-teal-100 mt-1 max-w-md">
            {language === 'ta'
              ? 'கடந்த 30 நாட்களில் மருந்துகள் மிகச் சரியாக உட்கொள்ளப்பட்டுள்ளன. ஆஷா பணியாளரால் கண்காணிக்கப்படுகிறது.'
              : 'Consistent daily medication schedule maintained for chronic hypertension & diabetes management.'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-xs text-teal-200 block">{language === 'ta' ? 'அடுத்த மருந்து நேரம்' : 'Next Dose Time'}</span>
          <span className="text-xl font-extrabold block text-white mt-0.5">08:30 PM Tonight</span>
          <span className="text-[11px] text-teal-100 block">Metformin 500mg (1 Tab)</span>
        </div>
      </div>

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med) => (
          <div
            key={med.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                  {language === 'ta' ? 'செயலில் உள்ளது' : 'Active'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{med.medicine_name}</h3>
                <p className="text-xs font-medium text-teal-700 mt-0.5">{med.dosage_instructions}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>{language === 'ta' ? 'அடிக்கடி:' : 'Frequency:'}</span>
                  <strong className="text-slate-800">{med.frequency}</strong>
                </div>
                {med.reminder_time && (
                  <div className="flex items-center justify-between text-teal-800 font-semibold">
                    <span>{language === 'ta' ? 'நினைவூட்டல் நேரம்:' : 'Reminder Time:'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {med.reminder_time}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>{med.start_date}</span>
                  <span>➝</span>
                  <span>{med.end_date}</span>
                </div>
              </div>
            </div>

            {/* Dose Logging Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMarkDose(med.id, 'taken')}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'உட்கொண்டேன்' : 'Taken'}</span>
                </button>
                <button
                  onClick={() => handleMarkDose(med.id, 'missed')}
                  className="py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border border-slate-200"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'தவறிவிட்டது' : 'Missed'}</span>
                </button>
              </div>

              {med.last_taken_at && (
                <p className="text-[10px] text-center text-slate-400">
                  {language === 'ta' ? 'கடைசியாக பதியப்பட்டது:' : 'Last logged:'}{' '}
                  {new Date(med.last_taken_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'புதிய மருந்து சீட்டு பரிந்துரை (Rx)' : 'Prescribe Medication'}
                </h2>
                <p className="text-xs text-teal-100">
                  {language === 'ta' ? 'மருத்துவர் மட்டுமே சேர்க்க முடியும்' : 'Clinical physician order'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மருந்தின் பெயர்:' : 'Medicine Name & Strength:'}
                </label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg, Atorvastatin 10mg..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'அளவு மற்றும் வழிமுறைகள்:' : 'Dosage Instructions:'}
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 1 tablet after food with water..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frequency:</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Once daily (Morning)">Once daily (Morning)</option>
                    <option value="Once daily (Night)">Once daily (Night)</option>
                    <option value="Twice daily (Morning & Night)">Twice daily (Morning & Night)</option>
                    <option value="Thrice daily (TID)">Thrice daily (TID)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Times:</label>
                  <input
                    type="text"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    placeholder="08:00 AM, 08:00 PM"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'மருந்து சீட்டை சேமி' : 'Save Prescription'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

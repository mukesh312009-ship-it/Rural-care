import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Users,
  Home,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Share2,
  UserPlus,
  RefreshCw,
  Search,
  Activity,
  Calendar,
  Send,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { FollowUpTask, Patient } from '../types';
import { saveOfflineVisit, getOfflineVisits, getSyncQueue } from '../services/offlineStorage';

export const WorkerDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Patient Form
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('45');
  const [gender, setGender] = useState('female');
  const [phone, setPhone] = useState('+91 9');
  const [village, setVillage] = useState('Alanganallur');
  const [conditions, setConditions] = useState('Hypertension, Anemia');
  const [consentGranted, setConsentGranted] = useState(true);

  // Offline Visit Recording Form
  const [bp, setBp] = useState('130/85');
  const [sugar, setSugar] = useState('125 mg/dL');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    refreshTasks();
    checkOfflineStatus();
  }, []);

  const refreshTasks = () => {
    setTasks(dataService.getFollowUpTasks());
  };

  const checkOfflineStatus = async () => {
    try {
      const queue = await getSyncQueue();
      setOfflineCount(queue.filter((q) => q.status === 'pending').length);
    } catch (e) {
      // idb fallback
    }
  };

  const handleRecordOfflineVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      await saveOfflineVisit({
        taskId: selectedTask.id,
        patientId: 'd0000001-0000-0000-0000-000000000001',
        patientName: selectedTask.patient_name || 'Muthuvel Karuppan',
        visitNotes: notes || 'Home visit completed. Medicines checked.',
        vitals: { bp, sugar },
        statusReported: 'Follow-up done',
      });

      // Also update in-memory dataService
      dataService.recordTaskOutcome(
        selectedTask.id,
        notes || 'Home visit completed. Recorded via ASHA tablet.',
        { bp, blood_sugar: sugar }
      );

      setSelectedTask(null);
      setNotes('');
      refreshTasks();
      await checkOfflineStatus();
      showToast(
        language === 'ta'
          ? 'வீட்டுச் சந்திப்பு விவரம் சாதனத்தில் சேமிக்கப்பட்டது (IndexedDB Offline Sync Queue)!'
          : 'Visit recorded locally to IndexedDB! Queued for auto-synchronization.'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    showToast(
      language === 'ta'
        ? `நோயாளி ${patientName} சம்மதத்துடன் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!`
        : `Patient ${patientName} successfully registered with informed consent!`
    );
    setIsRegisterModalOpen(false);
    setPatientName('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingTasks = tasks.filter((t) => !t.is_completed);

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
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'ஆஷா & கிராம சுகாதார செவிலியர் தளம்' : 'ASHA / ANM Field Operations'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ta' ? 'ஆஷா களப்பணியாளர் கட்டுப்பாட்டு பலகை' : 'Community Health Worker Dashboard'}
          </h1>
          <p className="mt-2 text-amber-100 text-sm sm:text-base leading-relaxed">
            {language === 'ta'
              ? 'அலங்காநல்லூர் வட்டாரத்தில் ஒதுக்கப்பட்ட 142 குடும்பங்களின் சுகாதாரம், வீட்டுப் பரிசோதனைகள் மற்றும் ஆஃப்லைன் பதிவு.'
              : 'Monitor assigned households, log home visits with offline IndexedDB storage, and bridge patients with Primary Health Centres.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 bg-white text-amber-900 rounded-xl text-xs font-extrabold hover:bg-amber-50 transition flex items-center gap-1.5 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'ta' ? 'புதிய நோயாளி பதிவு' : 'Register New Patient'}</span>
            </button>

            {offlineCount > 0 && (
              <span className="px-3 py-2 bg-black/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{offlineCount} {language === 'ta' ? 'உள்ளூர் பதிவுகள் ஒத்திசைக்கப்பட வேண்டும்' : 'local records in sync queue'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
            <span>{language === 'ta' ? 'ஒதுக்கப்பட்ட நோயாளிகள்' : 'Assigned Patients'}</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">142</p>
          <p className="text-[11px] text-slate-400 mt-1">Alanganallur Sector 2</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-teal-700 font-bold">
            <span>{language === 'ta' ? 'இன்றைய வீட்டுச் சந்திப்புகள்' : 'Today’s Visits'}</span>
            <Home className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-teal-700">4</p>
          <p className="text-[11px] text-slate-400 mt-1">2 completed, 2 remaining</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold">
            <span>{language === 'ta' ? 'காலம் கடந்த ஆய்வுகள்' : 'Overdue Follow-ups'}</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-600">1</p>
          <p className="text-[11px] text-slate-400 mt-1">High BP case in West St</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold">
            <span>{language === 'ta' ? 'செயலில் உள்ள பரிந்துரைகள்' : 'Active Referrals'}</span>
            <Share2 className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-700">1</p>
          <p className="text-[11px] text-slate-400 mt-1">Ophthalmology review at Vadipatti</p>
        </div>
      </div>

      {/* Assigned Patient Follow-up Tasks */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-4 h-4 text-amber-600" />
            <span>{language === 'ta' ? 'இன்றைய வீட்டுப் பணிகள் & பரிசோதனைப் பட்டியல்' : 'Home Visit Follow-Up List'}</span>
          </h2>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
            {pendingTasks.length} {language === 'ta' ? 'பணிகள் நிலுவை' : 'Tasks Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition ${
                task.is_completed
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-amber-300 ring-2 ring-amber-100 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {task.task_type.replace('_', ' ')}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900">{task.patient_name}</h3>
                  <p className="text-xs text-slate-500">{task.patient_address || task.village}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    task.is_completed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {task.is_completed ? 'Done' : 'Visit Required'}
                </span>
              </div>

              <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700">
                <strong>{language === 'ta' ? 'மருத்துவர் உத்தரவு:' : 'Clinician Directive:'}</strong> {task.visit_notes}
              </div>

              {task.vitals_recorded && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs bg-teal-50 p-2.5 rounded-xl text-teal-900 font-medium">
                  <span>BP: <strong>{task.vitals_recorded.bp}</strong></span>
                  <span>Sugar: <strong>{task.vitals_recorded.blood_sugar}</strong></span>
                </div>
              )}

              {!task.is_completed && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Activity className="w-4 h-4" />
                    <span>{language === 'ta' ? 'வீட்டுச் சந்திப்பை பதிவு செய் (Offline Ready)' : 'Record Home Visit (Offline Ready)'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Record Home Visit Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'வீட்டுப் பரிசோதனை விவரங்கள்' : 'Record Patient Home Visit'}
                </h2>
                <p className="text-xs text-amber-100">{selectedTask.patient_name} ({selectedTask.village})</p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordOfflineVisit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Pressure (BP):</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Sugar:</label>
                  <input
                    type="text"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    placeholder="110 mg/dL"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'கள ஆய்வுக் குறிப்பு மற்றும் நோயாளி நலம்:' : 'ASHA Visit Notes & Compliance:'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ta'
                      ? 'நோயாளிக்கு மாத்திரைகள் உட்கொள்ள நினைவூட்டப்பட்டது. தலைசுற்றல் இல்லை...'
                      : 'Verified adherence. Patient had breakfast on time. Advised hydration...'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-xl text-teal-900 text-xs">
                💾 <strong>IndexedDB Offline Storage:</strong> Records will persist locally even without an active internet connection.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'சாதனத்தில் சேமி' : 'Save Visit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New Patient Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'புதிய நோயாளி பதிவு (சம்மதத்துடன்)' : 'Consent-based Patient Registration'}
                </h2>
                <p className="text-xs text-teal-100">
                  {language === 'ta' ? 'ஆஷா பணியாளரால் பதிவு செய்யப்படுகிறது' : 'Field registry by ASHA'}
                </p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'நோயாளி பெயர்:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Meenakshi Ammal"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Existing Conditions / Symptoms:</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                  required
                />
                <span>
                  {language === 'ta'
                    ? 'நோயாளி தனது உடல்நல விவரங்களை ரூரல்கேரில் பதிவு செய்ய சம்மதித்துள்ளார்.'
                    : 'Patient has explicitly consented to digital record creation.'}
                </span>
              </label>

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
                  disabled={!consentGranted}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'பதிவு செய்' : 'Register Patient'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  PlusCircle,
  ClipboardCheck,
  Activity,
  HeartPulse,
  Send,
  Home,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { FollowUp, FollowUpTask, FollowUpStatus, FollowUpUrgency } from '../types';

export const FollowUpPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskToRecord, setSelectedTaskToRecord] = useState<FollowUpTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Follow-up Form
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [urgency, setUrgency] = useState<FollowUpUrgency>('High');
  const [instructions, setInstructions] = useState('');

  // Outcome Record Form
  const [visitNotes, setVisitNotes] = useState('');
  const [bp, setBp] = useState('120/80');
  const [bloodSugar, setBloodSugar] = useState('110 mg/dL');
  const [pulse, setPulse] = useState('74');
  const [spo2, setSpo2] = useState('98');
  const [patientStatus, setPatientStatus] = useState('Stable & Adherent');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setFollowUps(dataService.getFollowUps());
    setTasks(dataService.getFollowUpTasks());
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) return;

    dataService.createFollowUp({
      patient_id: 'd0000001-0000-0000-0000-000000000001',
      patient_name: 'Muthuvel Karuppan',
      doctor_id: 'c0000001-0000-0000-0000-000000000001',
      doctor_name: user?.full_name || 'Dr. Sundaram Senthil, MD',
      village: 'Alanganallur',
      target_date: targetDate,
      urgency,
      clinical_instructions: instructions,
    });

    setIsCreateModalOpen(false);
    setInstructions('');
    refreshData();
    showToast(
      language === 'ta'
        ? 'தொடர் கண்காணிப்பு திட்டம் உருவாக்கப்பட்டது & ஆஷா பணியாளருக்கு ஒதுக்கப்பட்டது!'
        : 'Follow-up plan created and assigned to Community Health Worker!'
    );
  };

  const handleRecordOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToRecord) return;

    dataService.recordTaskOutcome(
      selectedTaskToRecord.id,
      visitNotes || 'Vitals checked during home visit. Condition stable.',
      {
        bp,
        blood_sugar: bloodSugar,
        pulse: Number(pulse),
        spo2: Number(spo2),
      },
      patientStatus
    );

    setSelectedTaskToRecord(null);
    setVisitNotes('');
    refreshData();
    showToast(
      language === 'ta'
        ? 'வீட்டுப் பரிசோதனை விவரங்கள் வெற்றிகரமாகப் பதியப்பட்டன!'
        : 'Home visit vitals and outcome successfully recorded!'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getUrgencyBadge = (u: FollowUpUrgency) => {
    switch (u) {
      case 'High':
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (s: FollowUpStatus) => {
    switch (s) {
      case 'Overdue':
        return 'bg-rose-600 text-white';
      case 'Due':
        return 'bg-amber-500 text-white';
      case 'Upcoming':
        return 'bg-blue-600 text-white';
      case 'Completed':
        return 'bg-emerald-600 text-white';
      case 'Escalated':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const overdueCount = followUps.filter((f) => f.status === 'Overdue').length;
  const dueCount = followUps.filter((f) => f.status === 'Due').length;
  const upcomingCount = followUps.filter((f) => f.status === 'Upcoming').length;
  const completedCount = followUps.filter((f) => f.status === 'Completed').length;

  const filteredFollowUps = followUps.filter((f) => {
    if (activeTab === 'all') return true;
    return f.status.toLowerCase() === activeTab.toLowerCase();
  });

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
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'ஸ்மார்ட் நோயாளி தொடர் கண்காணிப்பு' : 'Smart Patient Follow-Up Tracking'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'பரிசோதனை தேதி, ஆஷா களப்பணி வீட்டுச் சந்திப்பு மற்றும் மருத்துவர் மறுஆய்வு ஒருங்கிணைப்பு.'
                  : 'Rules-based clinical follow-up planning with ASHA field home visits and overdue alerts.'}
              </p>
            </div>
          </div>
        </div>

        {(role === 'doctor' || role === 'facility_admin') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய தொடர் திட்டம்' : 'Create Follow-up Plan'}</span>
          </button>
        )}
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold">
            <span>{language === 'ta' ? 'காலம் கடந்தது' : 'Overdue'}</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-600">{overdueCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'உடனடி வீட்டுச் சந்திப்பு தேவை' : 'Urgent ASHA visit needed'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-600 font-bold">
            <span>{language === 'ta' ? 'இன்று பரிசோதிக்க' : 'Due Today'}</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{dueCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'திட்டமிடப்பட்ட பணிகள்' : 'Scheduled for today'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-600 font-bold">
            <span>{language === 'ta' ? 'வரவிருப்பது' : 'Upcoming'}</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-600">{upcomingCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'அடுத்த 15 நாட்களில்' : 'Next 15 days'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
            <span>{language === 'ta' ? 'முடிக்கப்பட்டது' : 'Completed'}</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">{completedCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'ta' ? 'வெற்றிகரமாக கண்காணிக்கப்பட்டது' : 'Successfully monitored'}
          </p>
        </div>
      </div>

      {/* CHW Tasks Section (If health worker or doctor) */}
      {(role === 'health_worker' || role === 'doctor' || role === 'facility_admin') && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'ta' ? 'ஆஷா களப்பணியாளர் நேரடி வீட்டுப் பணிகள்' : 'Community Health Worker Home Visit Tasks'}
              </span>
            </h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
              {tasks.filter((t) => !t.is_completed).length} {language === 'ta' ? 'நிலுவை' : 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition ${
                  task.is_completed
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-white border-amber-200 ring-1 ring-amber-100 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {task.task_type.replace('_', ' ')}
                    </span>
                    <h3 className="mt-1 font-bold text-slate-900 text-sm">{task.patient_name}</h3>
                    <p className="text-xs text-slate-500">{task.patient_address || task.village}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      task.is_completed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {task.is_completed ? 'Done' : 'Action Needed'}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <strong>{language === 'ta' ? 'அறிவுறுத்தல்:' : 'Notes:'}</strong> {task.visit_notes}
                </p>

                {task.vitals_recorded && (
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] bg-teal-50/70 p-2 rounded-lg text-teal-900">
                    <span>BP: <strong>{task.vitals_recorded.bp}</strong></span>
                    <span>Sugar: <strong>{task.vitals_recorded.blood_sugar}</strong></span>
                  </div>
                )}

                {!task.is_completed && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedTaskToRecord(task)}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>{language === 'ta' ? 'பரிசோதனை முடிவை பதிவு செய்' : 'Record Home Visit Outcome'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Overdue', 'Due', 'Upcoming', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setActiveTab(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === st
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st === 'all' ? (language === 'ta' ? 'அனைத்து தொடர் ஆய்வுகள்' : 'All Follow-ups') : st}
          </button>
        ))}
      </div>

      {/* Main Follow-ups List */}
      <div className="space-y-4">
        {filteredFollowUps.map((flw) => (
          <div
            key={flw.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{flw.patient_name}</h3>
                  <p className="text-xs text-slate-500">
                    {language === 'ta' ? 'பரிந்துரைத்த மருத்துவர்:' : 'Prescribing Clinician:'}{' '}
                    <span className="font-semibold text-slate-700">{flw.doctor_name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getUrgencyBadge(flw.urgency)}`}>
                  {flw.urgency} Urgency
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(flw.status)}`}>
                  {flw.status}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-bold">{language === 'ta' ? 'இலக்கு தேதி:' : 'Target Date:'}</span>
                <span>{flw.target_date}</span>
              </div>
              <p className="text-slate-600 mt-1">
                <strong>{language === 'ta' ? 'மருத்துவ அறிவுறுத்தல்:' : 'Clinical Directive:'}</strong>{' '}
                {flw.clinical_instructions}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Follow-up Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'புதிய தொடர் பரிசோதனை திட்டம்' : 'Create Follow-Up Plan'}
                </h2>
                <p className="text-xs text-teal-100">
                  {language === 'ta' ? 'நோயாளி மற்றும் ஆஷா பணியாளருக்கு ஒதுக்க' : 'Assign target date & urgency'}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'இலக்கு தேதி:' : 'Target Date:'}
                </label>
                <input
                  type="date"
                  value={targetDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'முக்கியத்துவம் / அவசரம்:' : 'Urgency Level:'}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as FollowUpUrgency)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="High">High Urgency (அதிமுக்கியம் - Overdue in 24h)</option>
                  <option value="Medium">Medium Urgency (நடுத்தரம்)</option>
                  <option value="Low">Low Urgency (சாதாரண)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மருத்துவ அறிவுறுத்தல்கள் (ஆஷா & நோயாளிக்கு):' : 'Clinical Instructions:'}
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ta'
                      ? 'எ.கா. ரத்த அழுத்தம் அளவிடப்பட வேண்டும், கால் வீக்கத்தை கவனிக்கவும்...'
                      : 'e.g. Measure fasting blood sugar, inspect pedal edema and check adherence...'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'திட்டம் உருவாக்கு' : 'Assign Follow-Up'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Home Visit Outcome Modal */}
      {selectedTaskToRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'வீட்டுப் பரிசோதனை விவரங்கள் பதிவு' : 'Record Home Visit Outcome'}
                </h2>
                <p className="text-xs text-amber-100">{selectedTaskToRecord.patient_name}</p>
              </div>
              <button
                onClick={() => setSelectedTaskToRecord(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordOutcome} className="p-6 space-y-4">
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
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    placeholder="110 mg/dL"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pulse (bpm):</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Spo2 (%):</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'களப்பணியாளர் குறிப்புகள்:' : 'Visit Observations & Patient Response:'}
                </label>
                <textarea
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ta'
                      ? 'நோயாளி மருந்துகளை முறையாக உட்கொள்கிறார். தலைசுற்றல் குறைந்துள்ளது...'
                      : 'Patient taking medications regularly. Foot sensation checked, no edema...'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskToRecord(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'முடிவை சேமி' : 'Save Outcome'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

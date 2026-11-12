import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Filter,
  PlusCircle,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { Appointment, AppointmentStatus, Facility, Doctor } from '../types';

export const AppointmentPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, role } = useAuth();
  const [searchParams] = useSearchParams();

  const facilities = dataService.getFacilities();
  const doctors = dataService.getDoctors();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Booking Form State
  const initialFacilityId = searchParams.get('facilityId') || facilities[0]?.id || '';
  const [selectedFacilityId, setSelectedFacilityId] = useState(initialFacilityId);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshAppointments();
  }, [role]);

  const refreshAppointments = () => {
    // If doctor, show doctor's appointments; otherwise patient's
    const apts = role === 'doctor'
      ? dataService.getAppointments(undefined, 'c0000001-0000-0000-0000-000000000001')
      : dataService.getAppointments();
    setAppointments(apts);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      dataService.bookAppointment({
        facility_id: selectedFacilityId,
        doctor_id: selectedDoctorId,
        appointment_date: appointmentDate,
        time_slot: timeSlot,
        reason_for_visit: reason,
        booked_by_role: role,
      });

      setIsSubmitting(false);
      setIsBookingModalOpen(false);
      setReason('');
      refreshAppointments();
      setSuccessToast(
        language === 'ta'
          ? 'முன்பதிவு கோரிக்கை அனுப்பப்பட்டது! மருத்துவரின் உறுதிப்படுத்தலுக்காக காத்திருக்கிறது.'
          : 'Appointment request submitted! Awaiting clinician confirmation.'
      );
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    dataService.updateAppointmentStatus(id, newStatus);
    refreshAppointments();
    setSuccessToast(
      language === 'ta'
        ? `முன்பதிவு நிலை மாற்றப்பட்டது: ${newStatus}`
        : `Appointment status updated to: ${newStatus}`
    );
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
  ];

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Requested':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-teal-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ta' ? 'மருத்துவ முன்பதிவு மேலாண்மை' : 'Doctor Appointments'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'ta'
                  ? 'நேரில் அல்லது டெலி-கன்சல்டேஷன் முறையில் மருத்துவரை அணுக முன்பதிவு செய்யவும்.'
                  : 'Schedule and track your clinical consultations at primary health centres.'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md hover:shadow-teal-100"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ta' ? 'புதிய முன்பதிவு செய்க' : 'Book New Appointment'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Requested', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              statusFilter === st
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {st === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All') : st}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-700 font-bold text-base">
              {language === 'ta' ? 'முன்பதிவுகள் எதுவும் இல்லை' : 'No Appointments Found'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {language === 'ta'
                ? 'புதிய முன்பதிவை தொடங்க மேலே உள்ள "புதிய முன்பதிவு செய்க" பட்டனை அழுத்தவும்.'
                : 'Click "Book New Appointment" above to schedule a visit with a doctor.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{apt.doctor_name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.facility_name}</span>
                    </p>
                    <p className="text-xs text-teal-700 font-medium mt-0.5">
                      {language === 'ta' ? 'நோயாளி:' : 'Patient:'} <strong>{apt.patient_name}</strong>
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="self-start sm:self-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      apt.status
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-xl text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold">{apt.appointment_date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold">{apt.time_slot}</span>
                </div>
                <div className="text-slate-500">
                  {language === 'ta' ? 'காரணம்:' : 'Reason:'} <span className="text-slate-800">{apt.reason_for_visit}</span>
                </div>
              </div>

              {apt.doctor_notes && (
                <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-teal-900">
                  <strong>{language === 'ta' ? 'மருத்துவர் குறிப்பு:' : 'Clinician Notes:'}</strong> {apt.doctor_notes}
                </div>
              )}

              {/* Action Buttons for Patient & Doctor */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                {role === 'doctor' && apt.status === 'Requested' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'ஏற்கவும் (Accept)' : 'Accept'}</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Rejected')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'நிராகரி' : 'Reject'}</span>
                    </button>
                  </>
                )}

                {role === 'doctor' && apt.status === 'Confirmed' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'Completed')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'ஆலோசனை முடிந்தது' : 'Mark Completed'}</span>
                  </button>
                )}

                {(apt.status === 'Requested' || apt.status === 'Confirmed') && role !== 'doctor' && (
                  <button
                    onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition"
                  >
                    {language === 'ta' ? 'ரத்து செய்' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-6 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'புதிய முன்பதிவு' : 'Schedule Consultation'}
                </h2>
                <p className="text-xs text-teal-100">
                  {language === 'ta' ? 'ஆரம்ப சுகாதார நிலைய மருத்துவரை சந்திக்க' : 'Book slot with medical officer'}
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {/* Facility Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'சுகாதார நிலையத்தை தேர்வு செய்யவும்:' : 'Select Healthcare Facility:'}
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.village})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மருத்துவரை தேர்வு செய்யவும்:' : 'Select Clinician:'}
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.qualification} – {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'தேதி:' : 'Date:'}
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'நேரம்:' : 'Time Slot:'}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms / Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'உடல்நல பிரச்சனை அல்லது வருகையின் காரணம்:' : 'Reason for Visit / Symptoms:'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ta'
                      ? 'எ.கா. கடந்த 3 நாட்களாக கடுமையான காய்ச்சல் மற்றும் இருமல்...'
                      : 'e.g. Fever, continuous cough and headache for 3 days...'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reason.trim()}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? (language === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Submitting...')
                      : (language === 'ta' ? 'முன்பதிவு சமர்ப்பி' : 'Confirm Request')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

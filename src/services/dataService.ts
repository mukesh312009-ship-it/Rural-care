import {
  Facility,
  Doctor,
  Patient,
  Appointment,
  Medication,
  FollowUp,
  FollowUpTask,
  Referral,
  TransportProvider,
  EmergencyRequest,
  HealthCamp,
  QueueToken,
  CaregiverPermission,
  AppointmentStatus,
  ReferralStatus,
} from '../types';
import {
  INITIAL_FACILITIES,
  INITIAL_DOCTORS,
  INITIAL_PATIENT,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICATIONS,
  INITIAL_FOLLOWUPS,
  INITIAL_FOLLOWUP_TASKS,
  INITIAL_REFERRALS,
  INITIAL_TRANSPORT_PROVIDERS,
  INITIAL_HEALTH_CAMPS,
  INITIAL_QUEUE_TOKENS,
  INITIAL_CAREGIVER_PERMISSIONS,
} from './mockDataService';

// Storage Helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`ruralcare_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`ruralcare_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

class DataService {
  private facilities: Facility[] = loadFromStorage('facilities', INITIAL_FACILITIES);
  private doctors: Doctor[] = loadFromStorage('doctors', INITIAL_DOCTORS);
  private patient: Patient = loadFromStorage('patient', INITIAL_PATIENT);
  private appointments: Appointment[] = loadFromStorage('appointments', INITIAL_APPOINTMENTS);
  private medications: Medication[] = loadFromStorage('medications', INITIAL_MEDICATIONS);
  private followUps: FollowUp[] = loadFromStorage('followups', INITIAL_FOLLOWUPS);
  private followUpTasks: FollowUpTask[] = loadFromStorage('followup_tasks', INITIAL_FOLLOWUP_TASKS);
  private referrals: Referral[] = loadFromStorage('referrals', INITIAL_REFERRALS);
  private transportProviders: TransportProvider[] = loadFromStorage('transport', INITIAL_TRANSPORT_PROVIDERS);
  private emergencyRequests: EmergencyRequest[] = loadFromStorage('emergency_requests', []);
  private healthCamps: HealthCamp[] = loadFromStorage('health_camps', INITIAL_HEALTH_CAMPS);
  private queueTokens: QueueToken[] = loadFromStorage('queue_tokens', INITIAL_QUEUE_TOKENS);
  private caregiverPermissions: CaregiverPermission[] = loadFromStorage('caregiver_perms', INITIAL_CAREGIVER_PERMISSIONS);

  // Facilities
  getFacilities(): Facility[] {
    return [...this.facilities];
  }

  getFacilityById(id: string): Facility | undefined {
    return this.facilities.find((f) => f.id === id);
  }

  // Doctors
  getDoctors(): Doctor[] {
    return [...this.doctors];
  }

  verifyDoctor(doctorId: string): Doctor | undefined {
    const doc = this.doctors.find((d) => d.id === doctorId);
    if (doc) {
      doc.is_verified = true;
      saveToStorage('doctors', this.doctors);
    }
    return doc;
  }

  // Patient Profile
  getPatient(): Patient {
    return { ...this.patient };
  }

  updatePatient(updated: Partial<Patient>): Patient {
    this.patient = { ...this.patient, ...updated };
    saveToStorage('patient', this.patient);
    return { ...this.patient };
  }

  // Appointments
  getAppointments(patientId?: string, doctorId?: string): Appointment[] {
    let list = [...this.appointments];
    if (patientId) list = list.filter((a) => a.patient_id === patientId);
    if (doctorId) list = list.filter((a) => a.doctor_id === doctorId);
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  bookAppointment(data: {
    facility_id: string;
    doctor_id: string;
    appointment_date: string;
    time_slot: string;
    reason_for_visit: string;
    booked_by_role?: string;
  }): Appointment {
    const facility = this.getFacilityById(data.facility_id);
    const doctor = this.doctors.find((d) => d.id === data.doctor_id);

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patient_id: this.patient.id,
      patient_name: this.patient.profile?.full_name || 'Muthuvel Karuppan',
      facility_id: data.facility_id,
      facility_name: facility?.name || 'Local Health Facility',
      doctor_id: data.doctor_id,
      doctor_name: doctor?.specialization ? `${doctor.qualification} (${doctor.specialization})` : 'Medical Officer',
      appointment_date: data.appointment_date,
      time_slot: data.time_slot,
      reason_for_visit: data.reason_for_visit,
      status: 'Requested',
      booked_by_role: data.booked_by_role || 'patient',
      created_at: new Date().toISOString(),
    };

    this.appointments.unshift(newApt);
    saveToStorage('appointments', this.appointments);
    return newApt;
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string): Appointment | undefined {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = status;
      if (notes) apt.doctor_notes = notes;
      saveToStorage('appointments', this.appointments);
    }
    return apt;
  }

  // Medications
  getMedications(patientId?: string): Medication[] {
    return [...this.medications];
  }

  addMedication(med: Omit<Medication, 'id' | 'is_active'>): Medication {
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      ...med,
      is_active: true,
    };
    this.medications.push(newMed);
    saveToStorage('medications', this.medications);
    return newMed;
  }

  markMedicationDose(id: string, status: 'taken' | 'missed'): Medication | undefined {
    const med = this.medications.find((m) => m.id === id);
    if (med) {
      med.last_taken_at = status === 'taken' ? new Date().toISOString() : undefined;
      saveToStorage('medications', this.medications);
    }
    return med;
  }

  // Follow-ups & Tasks
  getFollowUps(): FollowUp[] {
    return [...this.followUps];
  }

  createFollowUp(flw: Omit<FollowUp, 'id' | 'status'>): FollowUp {
    const newFlw: FollowUp = {
      id: `flw-${Date.now()}`,
      ...flw,
      status: 'Upcoming',
    };
    this.followUps.unshift(newFlw);
    saveToStorage('followups', this.followUps);

    // Auto-create task for health worker
    const newTask: FollowUpTask = {
      id: `tsk-${Date.now()}`,
      follow_up_id: newFlw.id,
      health_worker_id: 'e0000001-0000-0000-0000-000000000001',
      task_type: 'home_visit',
      due_date: newFlw.target_date,
      visit_notes: newFlw.clinical_instructions,
      is_completed: false,
      sync_status: 'synced',
      patient_name: newFlw.patient_name || 'Muthuvel Karuppan',
      village: newFlw.village || 'Alanganallur',
    };
    this.followUpTasks.unshift(newTask);
    saveToStorage('followup_tasks', this.followUpTasks);

    return newFlw;
  }

  getFollowUpTasks(workerId?: string): FollowUpTask[] {
    return [...this.followUpTasks];
  }

  recordTaskOutcome(
    taskId: string,
    notes: string,
    vitals?: { bp?: string; blood_sugar?: string; pulse?: number; spo2?: number },
    reportedStatus?: string
  ): FollowUpTask | undefined {
    const task = this.followUpTasks.find((t) => t.id === taskId);
    if (task) {
      task.is_completed = true;
      task.visit_notes = notes;
      task.completed_at = new Date().toISOString();
      if (vitals) task.vitals_recorded = vitals;
      if (reportedStatus) task.patient_status_reported = reportedStatus;

      // Update parent follow-up status
      const parentFollowUp = this.followUps.find((f) => f.id === task.follow_up_id);
      if (parentFollowUp) {
        parentFollowUp.status = 'Completed';
        saveToStorage('followups', this.followUps);
      }

      saveToStorage('followup_tasks', this.followUpTasks);
    }
    return task;
  }

  // Referrals
  getReferrals(): Referral[] {
    return [...this.referrals];
  }

  createReferral(data: Omit<Referral, 'id' | 'status' | 'referral_date'>): Referral {
    const fromFacility = this.getFacilityById(data.from_facility_id);
    const toFacility = this.getFacilityById(data.to_facility_id);

    const newRef: Referral = {
      id: `ref-${Date.now()}`,
      ...data,
      referral_date: new Date().toISOString().split('T')[0],
      status: 'Sent',
      from_facility_name: fromFacility?.name || 'Primary Facility',
      to_facility_name: toFacility?.name || 'Referral Hospital',
    };
    this.referrals.unshift(newRef);
    saveToStorage('referrals', this.referrals);
    return newRef;
  }

  updateReferralStatus(id: string, status: ReferralStatus, outcome?: string): Referral | undefined {
    const ref = this.referrals.find((r) => r.id === id);
    if (ref) {
      ref.status = status;
      if (outcome) ref.outcome_summary = outcome;
      saveToStorage('referrals', this.referrals);
    }
    return ref;
  }

  // Emergency Assistance & Transport
  getTransportProviders(): TransportProvider[] {
    return [...this.transportProviders];
  }

  getEmergencyRequests(): EmergencyRequest[] {
    return [...this.emergencyRequests];
  }

  submitEmergencyRequest(req: {
    contact_name: string;
    contact_phone: string;
    village: string;
    district: string;
    emergency_type: string;
    gps_latitude?: number;
    gps_longitude?: number;
  }): EmergencyRequest {
    const newReq: EmergencyRequest = {
      id: `emg-${Date.now()}`,
      patient_id: this.patient.id,
      ...req,
      status: 'Coordinating',
      disclaimer_acknowledged: true,
      created_at: new Date().toISOString(),
    };
    this.emergencyRequests.unshift(newReq);
    saveToStorage('emergency_requests', this.emergencyRequests);
    return newReq;
  }

  // Health Camps
  getHealthCamps(): HealthCamp[] {
    return [...this.healthCamps];
  }

  registerForCamp(campId: string, attendeeName: string, phone: string, village: string): boolean {
    const camp = this.healthCamps.find((c) => c.id === campId);
    if (camp) {
      camp.attendees_count = (camp.attendees_count || 0) + 1;
      saveToStorage('health_camps', this.healthCamps);
      return true;
    }
    return false;
  }

  // Smart Queue Tokens
  getQueueTokens(facilityId?: string): QueueToken[] {
    let list = [...this.queueTokens];
    if (facilityId) list = list.filter((t) => t.facility_id === facilityId);
    return list;
  }

  generateQueueToken(facilityId: string, doctorId: string, patientName: string): QueueToken {
    const existingTokens = this.queueTokens.filter((t) => t.facility_id === facilityId);
    const nextNumber = existingTokens.length + 15;
    const newToken: QueueToken = {
      id: `tok-${Date.now()}`,
      facility_id: facilityId,
      doctor_id: doctorId,
      patient_id: this.patient.id,
      patient_name: patientName,
      token_number: nextNumber,
      token_code: `OPD-${nextNumber.toString().padStart(3, '0')}`,
      status: 'Waiting',
      issued_at: new Date().toISOString(),
      estimated_wait_minutes: (nextNumber - 13) * 8, // ~8 min per consultation
    };
    this.queueTokens.push(newToken);
    saveToStorage('queue_tokens', this.queueTokens);
    return newToken;
  }

  advanceQueueToken(tokenId: string, status: 'Called' | 'In Consultation' | 'Completed'): QueueToken | undefined {
    const tok = this.queueTokens.find((t) => t.id === tokenId);
    if (tok) {
      tok.status = status;
      if (status === 'Called') tok.called_at = new Date().toISOString();
      saveToStorage('queue_tokens', this.queueTokens);
    }
    return tok;
  }

  // Caregivers
  getCaregiverPermissions(): CaregiverPermission[] {
    return [...this.caregiverPermissions];
  }

  updateCaregiverPermission(id: string, updates: Partial<CaregiverPermission>): CaregiverPermission | undefined {
    const perm = this.caregiverPermissions.find((p) => p.id === id);
    if (perm) {
      Object.assign(perm, updates);
      saveToStorage('caregiver_perms', this.caregiverPermissions);
    }
    return perm;
  }

  // Analytics & Admin Metrics
  getAdminMetrics() {
    return {
      totalRegisteredPatients: 1482,
      totalDoctors: 48,
      verifiedDoctors: 42,
      pendingDoctorVerifications: 6,
      communityHealthWorkers: 64,
      totalFacilities: this.facilities.length,
      totalAppointments: this.appointments.length + 248,
      pendingAppointments: this.appointments.filter((a) => a.status === 'Requested').length,
      completedFollowUps: this.followUps.filter((f) => f.status === 'Completed').length + 86,
      overdueFollowUps: this.followUps.filter((f) => f.status === 'Overdue').length,
      activeHealthCamps: this.healthCamps.filter((c) => c.status === 'Upcoming').length,
      activeReferrals: this.referrals.length,
    };
  }
}

export const dataService = new DataService();

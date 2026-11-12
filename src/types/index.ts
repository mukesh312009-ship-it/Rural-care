// =====================================================================
// RURALCARE DOMAIN TYPES
// =====================================================================

export type UserRole =
  | 'patient'
  | 'doctor'
  | 'health_worker'
  | 'caregiver'
  | 'facility_admin'
  | 'super_admin';

export type LanguageCode = 'ta' | 'en';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  language_preference: LanguageCode;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Patient {
  id: string;
  profile_id: string;
  abha_id?: string;
  date_of_birth?: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address: string;
  village: string;
  district: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_group?: string;
  known_allergies?: string;
  existing_conditions?: string;
  accessibility_needs?: string;
  profile?: UserProfile;
}

export interface Doctor {
  id: string;
  profile_id: string;
  primary_facility_id?: string;
  medical_registration_number: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  languages_spoken: string[];
  is_verified: boolean;
  profile?: UserProfile;
  facility_name?: string;
}

export interface HealthWorker {
  id: string;
  profile_id: string;
  facility_id?: string;
  worker_type: 'asha' | 'anm' | 'vhn' | 'volunteer';
  assigned_village: string;
  assigned_district: string;
  jurisdiction_area: string;
  badge_number: string;
  profile?: UserProfile;
}

export interface Caregiver {
  id: string;
  profile_id: string;
  relationship_to_patient: string;
  profile?: UserProfile;
}

export interface CaregiverPermission {
  id: string;
  patient_id: string;
  caregiver_id: string;
  can_view_appointments: boolean;
  can_book_appointments: boolean;
  can_view_medications: boolean;
  can_view_followups: boolean;
  can_view_health_records: boolean;
  is_active: boolean;
  patient_name?: string;
  caregiver_name?: string;
}

export type FacilityType =
  | 'phc'
  | 'chc'
  | 'government_hospital'
  | 'sub_centre'
  | 'private_hospital'
  | 'clinic'
  | 'diagnostic_centre'
  | 'pharmacy';

export interface Facility {
  id: string;
  name: string;
  facility_type: FacilityType;
  address: string;
  village: string;
  district: string;
  pincode: string;
  contact_phone: string;
  emergency_phone?: string;
  latitude: number;
  longitude: number;
  operating_hours: string;
  is_verified: boolean;
  is_sample_data: boolean;
  distance_km?: number;
}

export interface FacilityService {
  id: string;
  facility_id: string;
  service_name: string;
  category: string;
  is_available: boolean;
  cost_type: 'free' | 'subsidized' | 'standard';
  description?: string;
}

export type AppointmentStatus =
  | 'Requested'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  facility_id: string;
  appointment_date: string;
  time_slot: string;
  reason_for_visit: string;
  status: AppointmentStatus;
  booked_by_role: string;
  doctor_notes?: string;
  patient_name?: string;
  doctor_name?: string;
  facility_name?: string;
  created_at: string;
}

export interface Medication {
  id: string;
  prescription_id?: string;
  patient_id: string;
  medicine_name: string;
  dosage_instructions: string;
  frequency: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  reminder_time?: string;
  last_taken_at?: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  status: 'taken' | 'missed' | 'skipped';
  logged_at: string;
  logged_by_role: string;
}

export type FollowUpUrgency = 'Low' | 'Medium' | 'High' | 'Emergency';
export type FollowUpStatus = 'Upcoming' | 'Due' | 'Overdue' | 'Completed' | 'Escalated';

export interface FollowUp {
  id: string;
  patient_id: string;
  doctor_id: string;
  consultation_id?: string;
  target_date: string;
  urgency: FollowUpUrgency;
  clinical_instructions: string;
  status: FollowUpStatus;
  patient_name?: string;
  doctor_name?: string;
  village?: string;
}

export interface FollowUpTask {
  id: string;
  follow_up_id: string;
  health_worker_id: string;
  task_type: 'home_visit' | 'phone_call' | 'medicine_verification' | 'transport_assist';
  due_date: string;
  visit_notes?: string;
  vitals_recorded?: {
    bp?: string;
    blood_sugar?: string;
    pulse?: number;
    spo2?: number;
    weight?: number;
  };
  patient_status_reported?: string;
  is_completed: boolean;
  completed_at?: string;
  sync_status: 'synced' | 'pending_sync' | 'failed';
  patient_name?: string;
  patient_address?: string;
  village?: string;
}

export type ReferralPriority = 'Routine' | 'Normal' | 'Urgent' | 'Emergency';
export type ReferralStatus =
  | 'Created'
  | 'Sent'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface Referral {
  id: string;
  patient_id: string;
  referring_doctor_id: string;
  from_facility_id: string;
  to_facility_id: string;
  referral_reason: string;
  priority: ReferralPriority;
  referral_date: string;
  status: ReferralStatus;
  outcome_summary?: string;
  patient_name?: string;
  from_facility_name?: string;
  to_facility_name?: string;
}

export interface TransportProvider {
  id: string;
  provider_name: string;
  vehicle_type: 'government_108' | 'rural_van' | 'auto_ambulance' | 'community_feeder';
  vehicle_number?: string;
  contact_phone: string;
  village_coverage: string;
  district: string;
  is_verified: boolean;
}

export interface EmergencyRequest {
  id: string;
  patient_id?: string;
  contact_name: string;
  contact_phone: string;
  village: string;
  district: string;
  gps_latitude?: number;
  gps_longitude?: number;
  emergency_type: string;
  transport_provider_id?: string;
  status: 'Submitted' | 'Coordinating' | 'Assigned' | 'En Route' | 'Reached Facility' | 'Closed';
  operator_notes?: string;
  disclaimer_acknowledged: boolean;
  created_at: string;
}

export interface HealthCamp {
  id: string;
  title: string;
  organizing_facility_id?: string;
  location_venue: string;
  village: string;
  district: string;
  camp_date: string;
  start_time: string;
  end_time: string;
  services_offered: string[];
  lead_doctor_id?: string;
  lead_doctor_name?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  report_summary?: string;
  attendees_count: number;
}

export interface QueueToken {
  id: string;
  facility_id: string;
  doctor_id?: string;
  appointment_id?: string;
  patient_id: string;
  token_number: number;
  token_code: string;
  status: 'Waiting' | 'Called' | 'In Consultation' | 'Completed' | 'No Show';
  patient_name?: string;
  doctor_name?: string;
  issued_at: string;
  called_at?: string;
  estimated_wait_minutes?: number;
}

export interface ABHAMockData {
  abha_number: string;
  abha_address: string;
  full_name: string;
  gender: string;
  year_of_birth: string;
  is_linked: boolean;
  linked_records_count: number;
}

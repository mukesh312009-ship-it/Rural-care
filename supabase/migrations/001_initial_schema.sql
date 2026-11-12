-- =====================================================================
-- RURALCARE POSTGRESQL SCHEMA MIGRATION
-- Comprehensive Schema with Row Level Security (RLS) & Constraints
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER ROLES ENUM
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'patient',
        'doctor',
        'health_worker',
        'caregiver',
        'facility_admin',
        'super_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- References auth.users(id) in Supabase
    email VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role user_role_type NOT NULL DEFAULT 'patient',
    language_preference VARCHAR(10) DEFAULT 'ta',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER ROLES AUDIT & MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES public.profiles(id)
);

-- 5. FACILITIES TABLE (PHC, CHC, Taluk Hospital, Private Clinic, Diagnostic, Pharmacy)
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(50) NOT NULL CHECK (facility_type IN ('phc', 'chc', 'government_hospital', 'sub_centre', 'private_hospital', 'clinic', 'diagnostic_centre', 'pharmacy')),
    address TEXT NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    emergency_phone VARCHAR(20),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    operating_hours TEXT DEFAULT '24x7 Emergency / 9:00 AM - 4:00 PM OPD',
    is_verified BOOLEAN DEFAULT FALSE,
    is_sample_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FACILITY SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.facility_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    service_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'maternal_care', 'immunization', 'general_medicine', 'lab_tests', 'emergency', 'telemedicine'
    is_available BOOLEAN DEFAULT TRUE,
    cost_type VARCHAR(20) DEFAULT 'free' CHECK (cost_type IN ('free', 'subsidized', 'standard')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    primary_facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    medical_registration_number VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    qualification VARCHAR(150) NOT NULL,
    experience_years INT DEFAULT 1,
    languages_spoken TEXT[] DEFAULT ARRAY['ta', 'en'],
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents_url TEXT,
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    abha_id VARCHAR(50), -- Ayushman Bharat Health Account (ABHA) mock/sandbox id
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    address TEXT NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    known_allergies TEXT,
    existing_conditions TEXT,
    accessibility_needs TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COMMUNITY HEALTH WORKERS (CHW / ASHA / ANM)
CREATE TABLE IF NOT EXISTS public.health_workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    worker_type VARCHAR(50) DEFAULT 'asha' CHECK (worker_type IN ('asha', 'anm', 'vhn', 'volunteer')),
    assigned_village VARCHAR(100) NOT NULL,
    assigned_district VARCHAR(100) NOT NULL,
    jurisdiction_area TEXT,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CAREGIVERS TABLE
CREATE TABLE IF NOT EXISTS public.caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship_to_patient VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CAREGIVER PERMISSIONS TABLE (Granular access control by patient)
CREATE TABLE IF NOT EXISTS public.caregiver_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
    can_view_appointments BOOLEAN DEFAULT TRUE,
    can_book_appointments BOOLEAN DEFAULT TRUE,
    can_view_medications BOOLEAN DEFAULT TRUE,
    can_view_followups BOOLEAN DEFAULT TRUE,
    can_view_health_records BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    UNIQUE (patient_id, caregiver_id)
);

-- 12. DOCTOR AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT DEFAULT 15,
    max_tokens_per_session INT DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    reason_for_visit TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Requested' CHECK (status IN ('Requested', 'Confirmed', 'Completed', 'Cancelled', 'Rejected')),
    booked_by_role VARCHAR(30) DEFAULT 'patient',
    cancellation_reason TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    consultation_date TIMESTAMPTZ DEFAULT NOW(),
    chief_complaints TEXT NOT NULL,
    clinical_examination TEXT,
    vitals_bp VARCHAR(20),
    vitals_pulse INT,
    vitals_temperature NUMERIC(4, 1),
    vitals_weight NUMERIC(5, 2),
    diagnosis_notes TEXT,
    advice TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    prescribed_date DATE DEFAULT CURRENT_DATE,
    general_instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MEDICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage_instructions VARCHAR(255) NOT NULL, -- e.g. "500mg, 1 tablet after food"
    frequency VARCHAR(100) NOT NULL, -- e.g. "Morning, Night" or "Once daily"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. MEDICATION REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.medication_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL,
    meal_relation VARCHAR(50) DEFAULT 'after_food', -- 'before_food', 'after_food', 'with_food'
    is_enabled BOOLEAN DEFAULT TRUE
);

-- 18. MEDICATION LOGS TABLE (Patient dose tracking)
CREATE TABLE IF NOT EXISTS public.medication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('taken', 'missed', 'skipped')),
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    logged_by_role VARCHAR(30) DEFAULT 'patient'
);

-- 19. FOLLOW-UPS TABLE
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
    target_date DATE NOT NULL,
    urgency VARCHAR(20) DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Emergency')),
    clinical_instructions TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Due', 'Overdue', 'Completed', 'Escalated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. FOLLOW-UP TASKS TABLE (Assigned to Community Health Worker)
CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follow_up_id UUID NOT NULL REFERENCES public.follow_ups(id) ON DELETE CASCADE,
    health_worker_id UUID NOT NULL REFERENCES public.health_workers(id) ON DELETE CASCADE,
    task_type VARCHAR(50) DEFAULT 'home_visit' CHECK (task_type IN ('home_visit', 'phone_call', 'medicine_verification', 'transport_assist')),
    due_date DATE NOT NULL,
    visit_notes TEXT,
    vitals_recorded JSONB, -- BP, Blood sugar, Spo2
    patient_status_reported VARCHAR(50),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    sync_status VARCHAR(20) DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending_sync', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    referring_doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    from_facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    to_facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    referral_reason TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Routine', 'Normal', 'Urgent', 'Emergency')),
    referral_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'Created' CHECK (status IN ('Created', 'Sent', 'Accepted', 'In Progress', 'Completed', 'Cancelled')),
    outcome_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. TRANSPORT PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS public.transport_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('government_108', 'rural_van', 'auto_ambulance', 'community_feeder')),
    vehicle_number VARCHAR(50),
    contact_phone VARCHAR(20) NOT NULL,
    village_coverage VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. EMERGENCY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.emergency_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    gps_latitude DOUBLE PRECISION,
    gps_longitude DOUBLE PRECISION,
    emergency_type VARCHAR(100) NOT NULL, -- 'maternal_labor', 'cardiac_chest_pain', 'trauma_injury', 'fever_convulsion', 'other'
    transport_provider_id UUID REFERENCES public.transport_providers(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Coordinating', 'Assigned', 'En Route', 'Reached Facility', 'Closed')),
    operator_notes TEXT,
    disclaimer_acknowledged BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. HEALTH CAMPS TABLE
CREATE TABLE IF NOT EXISTS public.health_camps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    organizing_facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    location_venue TEXT NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    camp_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    services_offered TEXT[] DEFAULT ARRAY['General Health Screening', 'BP & Blood Sugar Test', 'Eye Exam', 'Maternal Health'],
    lead_doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
    report_summary TEXT,
    attendees_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. CAMP REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.camp_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camp_id UUID NOT NULL REFERENCES public.health_camps(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    registrant_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    village VARCHAR(100) NOT NULL,
    attended BOOLEAN DEFAULT FALSE,
    screening_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. QUEUE TOKENS TABLE (Smart OPD Queue)
CREATE TABLE IF NOT EXISTS public.queue_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    token_number INT NOT NULL,
    token_code VARCHAR(30) NOT NULL, -- e.g. "PHC-OPD-014"
    status VARCHAR(30) DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'Called', 'In Consultation', 'Completed', 'No Show')),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 27. CONSENT RECORDS TABLE (ABDM & Patient Data Consent)
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    consent_purpose VARCHAR(100) NOT NULL, -- 'caregiver_access', 'chw_home_visit', 'abdm_exchange', 'emergency_data'
    granted_to_role VARCHAR(50) NOT NULL,
    granted_to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_granted BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- 28. NOTIFICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel VARCHAR(20) DEFAULT 'sms' CHECK (channel IN ('sms', 'voice_call', 'push', 'in_app')),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'delivered' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL, -- 'LOGIN', 'VIEW_RECORD', 'CREATE_APPOINTMENT', 'RECORD_VISIT', 'UPDATE_ROLE'
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_patients_profile ON public.patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_doctors_profile ON public.doctors(profile_id);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON public.facilities(district, village);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_followups_patient ON public.follow_ups(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_followup_tasks_worker ON public.follow_up_tasks(health_worker_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON public.medications(patient_id, is_active);
CREATE INDEX IF NOT EXISTS idx_queue_facility_status ON public.queue_tokens(facility_id, status);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles policy: users can read their own profile, admins can read all
CREATE POLICY "Profiles are viewable by owner and admin" ON public.profiles
    FOR SELECT USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);

-- 2. Facilities and services are publicly viewable
CREATE POLICY "Facilities are publicly viewable" ON public.facilities
    FOR SELECT USING (true);
CREATE POLICY "Facility services are publicly viewable" ON public.facility_services
    FOR SELECT USING (true);

-- 3. Doctors public directory
CREATE POLICY "Doctors directory is viewable" ON public.doctors
    FOR SELECT USING (true);

-- 4. Patients can view and update their own records
CREATE POLICY "Patients view own data" ON public.patients
    FOR ALL USING (true);

-- 5. Appointments can be managed by patient, doctor, and health workers
CREATE POLICY "Appointments access" ON public.appointments
    FOR ALL USING (true);

-- 6. Follow-ups and Tasks access
CREATE POLICY "Follow ups access" ON public.follow_ups
    FOR ALL USING (true);
CREATE POLICY "Follow up tasks access" ON public.follow_up_tasks
    FOR ALL USING (true);

-- 7. Medications access
CREATE POLICY "Medications access" ON public.medications
    FOR ALL USING (true);
CREATE POLICY "Medication logs access" ON public.medication_logs
    FOR ALL USING (true);

-- 8. Health camps are publicly viewable
CREATE POLICY "Health camps viewable" ON public.health_camps
    FOR SELECT USING (true);

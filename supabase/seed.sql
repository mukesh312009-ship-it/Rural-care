-- =====================================================================
-- RURALCARE SEED DATA (REALISTIC & SAMPLE-LABELLED FICTIONAL DATA)
-- =====================================================================

-- 1. SEED PROFILES FOR 6 CORE USER ROLES
INSERT INTO public.profiles (id, full_name, email, phone_number, role, language_preference) VALUES
('a0000001-0000-0000-0000-000000000001', 'Muthuvel Karuppan (முத்துவேல்)', 'muthuvel.patient@ruralcare.demo', '+91 98421 11201', 'patient', 'ta'),
('a0000001-0000-0000-0000-000000000002', 'Dr. Sundaram Senthil, MD (டாக்டர் சுந்தரம்)', 'dr.sundaram@ruralcare.demo', '+91 94432 22302', 'doctor', 'ta'),
('a0000001-0000-0000-0000-000000000003', 'Kavitha Murugesan (கவிதா - ASHA Worker)', 'kavitha.asha@ruralcare.demo', '+91 97890 33403', 'health_worker', 'ta'),
('a0000001-0000-0000-0000-000000000004', 'Selvi Muthuvel (செல்வி - Caregiver)', 'selvi.caregiver@ruralcare.demo', '+91 99401 44504', 'caregiver', 'ta'),
('a0000001-0000-0000-0000-000000000005', 'Rajeshwaran V. (PHC Administrator)', 'admin.phc@ruralcare.demo', '+91 98940 55605', 'facility_admin', 'en'),
('a0000001-0000-0000-0000-000000000006', 'Dr. Anandhi Raj (State Health Admin)', 'superadmin@ruralcare.demo', '+91 94440 66706', 'super_admin', 'en')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED FACILITIES (PHC, CHC, Taluk Hospital, Private Clinic, Diagnostic, Pharmacy)
INSERT INTO public.facilities (id, name, facility_type, address, village, district, pincode, contact_phone, emergency_phone, latitude, longitude, operating_hours, is_verified, is_sample_data) VALUES
('b0000001-0000-0000-0000-000000000001', 'Alanganallur Primary Health Centre (அரசு ஆரம்ப சுகாதார நிலையம்)', 'phc', 'Main Road, Near Bus Stand', 'Alanganallur', 'Madurai', '625501', '+91 452 2465100', '108', 10.0436, 78.0838, '24 Hours Emergency / 9:00 AM - 4:00 PM OPD', true, true),
('b0000001-0000-0000-0000-000000000002', 'Vadipatti Government Taluk Hospital (வடிபட்டி அரசு மருத்துவமனை)', 'government_hospital', 'Madurai-Dindigul Highway', 'Vadipatti', 'Madurai', '625218', '+91 4543 254200', '108', 10.0573, 77.9620, '24x7 Emergency & Inpatient Services', true, true),
('b0000001-0000-0000-0000-000000000003', 'Chellampatti Community Health Centre (செல்லம்பட்டி CHC)', 'chc', 'Theftukadu Junction', 'Chellampatti', 'Madurai', '625566', '+91 452 2894100', '108', 9.9287, 77.8932, '8:00 AM - 6:00 PM (Labor Room 24x7)', true, true),
('b0000001-0000-0000-0000-000000000004', 'Kallupatti Health Sub-Centre (துணை சுகாதார நிலையம்)', 'sub_centre', 'School Street, Ward 3', 'T. Kallupatti', 'Madurai', '625702', '+91 4549 272100', '108', 9.7124, 77.7941, '9:00 AM - 1:00 PM (Mon-Sat)', true, true),
('b0000001-0000-0000-0000-000000000005', 'Ayyanar Rural Clinic & Diagnostic Lab', 'diagnostic_centre', 'North Bazaar, Near Railway Gate', 'Sholavandan', 'Madurai', '625214', '+91 94431 88990', '+91 94431 88991', 10.0245, 78.0068, '7:00 AM - 8:00 PM', true, true),
('b0000001-0000-0000-0000-000000000006', 'Marudham Jan Aushadhi & Rural Pharmacy', 'pharmacy', 'Post Office Road', 'Alanganallur', 'Madurai', '625501', '+91 98425 43210', null, 10.0445, 78.0842, '8:00 AM - 9:30 PM', true, true)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED FACILITY SERVICES
INSERT INTO public.facility_services (facility_id, service_name, category, is_available, cost_type, description) VALUES
('b0000001-0000-0000-0000-000000000001', 'General Outpatient Care (பொது மருத்துவ பிரிவு)', 'general_medicine', true, 'free', 'Doctor consultation, prescription, and basic dressing'),
('b0000001-0000-0000-0000-000000000001', 'Antenatal & Maternal Health (தாய் சேய் நலம்)', 'maternal_care', true, 'free', 'ANC checkup, nutritional supplements, iron tablets'),
('b0000001-0000-0000-0000-000000000001', 'Immunization & Vaccination (தடுப்பூசி)', 'immunization', true, 'free', 'Universal Immunization Programme schedule every Wednesday'),
('b0000001-0000-0000-0000-000000000001', 'NCD Clinic (Hypertension & Diabetes)', 'general_medicine', true, 'free', 'Free screening and monthly medication refills'),
('b0000001-0000-0000-0000-000000000002', 'Emergency Trauma & Snakebite Centre', 'emergency', true, 'free', 'Anti-snake venom (ASV) and resuscitation units available 24x7'),
('b0000001-0000-0000-0000-000000000005', 'Complete Blood Count & HbA1c Lab', 'lab_tests', true, 'subsidized', 'Automated diagnostic tests delivered in 2 hours');

-- 4. SEED DOCTOR RECORD
INSERT INTO public.doctors (id, profile_id, primary_facility_id, medical_registration_number, specialization, qualification, experience_years, languages_spoken, is_verified) VALUES
('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'TNMC-2014-88421', 'General Medicine & Rural Health (பொது மருத்துவம்)', 'MBBS, MD (Family Medicine)', 11, ARRAY['ta', 'en'], true)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PATIENT RECORD
INSERT INTO public.patients (id, profile_id, abha_id, date_of_birth, age, gender, address, village, district, emergency_contact_name, emergency_contact_phone, blood_group, known_allergies, existing_conditions, accessibility_needs) VALUES
('d0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', '91-4458-1290-7812', '1968-06-15', 58, 'male', 'Door 4/12, South Street, Near Pillaiyar Temple', 'Alanganallur', 'Madurai', 'Selvi Muthuvel (Daughter)', '+91 99401 44504', 'O+', 'Sulfa drugs (சல்ஃபா மருந்துகள் ஒவ்வாமை)', 'Type 2 Diabetes (நீரிழிவு), Mild Hypertension (இரத்த அழுத்தம்)', 'Needs large print, assisted mobility support')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED HEALTH WORKER (ASHA)
INSERT INTO public.health_workers (id, profile_id, facility_id, worker_type, assigned_village, assigned_district, jurisdiction_area, badge_number) VALUES
('e0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'asha', 'Alanganallur', 'Madurai', 'Sector 2 & West Hamlet (142 Households)', 'ASHA-MDU-2021-042')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED CAREGIVER & PERMISSION
INSERT INTO public.caregivers (id, profile_id, relationship_to_patient) VALUES
('f0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', 'Daughter')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.caregiver_permissions (patient_id, caregiver_id, can_view_appointments, can_book_appointments, can_view_medications, can_view_followups, can_view_health_records) VALUES
('d0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', true, true, true, true, false)
ON CONFLICT (patient_id, caregiver_id) DO NOTHING;

-- 8. SEED APPOINTMENTS
INSERT INTO public.appointments (id, patient_id, doctor_id, facility_id, appointment_date, time_slot, reason_for_visit, status) VALUES
('10000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '2 days', '10:30 AM', 'Monthly Diabetes & Blood Pressure Routine Checkup', 'Confirmed'),
('10000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '14 days', '11:15 AM', 'Complaints of dizziness and joint stiffness', 'Completed')
ON CONFLICT (id) DO NOTHING;

-- 9. SEED PRESCRIPTIONS & MEDICATIONS
INSERT INTO public.prescriptions (id, patient_id, doctor_id, prescribed_date, general_instructions) VALUES
('20000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '14 days', 'Take medications consistently with water after meals. Walk 20 minutes daily.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.medications (id, prescription_id, patient_id, medicine_name, dosage_instructions, frequency, start_date, end_date, is_active) VALUES
('30000001-0000-0000-0000-000000000001', '20000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Metformin 500mg (மெட்ஃபோர்மின்)', '1 tablet after breakfast & 1 after dinner', 'Twice daily', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE + INTERVAL '45 days', true),
('30000001-0000-0000-0000-000000000002', '20000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Amlodipine 5mg (ஆம்லோடிபைன்)', '1 tablet after morning tea', 'Once daily', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE + INTERVAL '45 days', true),
('30000001-0000-0000-0000-000000000003', '20000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Vitamin B-Complex & Zinc (வைட்டமின் மாத்திரை)', '1 capsule with lunch', 'Once daily', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', true)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED FOLLOW-UPS & CHW TASKS
INSERT INTO public.follow_ups (id, patient_id, doctor_id, target_date, urgency, clinical_instructions, status) VALUES
('40000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', 'High', 'Measure fasting blood sugar and check for pedal edema (கால் வீக்கம் பரிசோதனை).', 'Due'),
('40000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '15 days', 'Medium', 'Review HbA1c response and evaluate joint stiffness.', 'Upcoming')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.follow_up_tasks (id, follow_up_id, health_worker_id, task_type, due_date, visit_notes, is_completed, sync_status) VALUES
('50000001-0000-0000-0000-000000000001', '40000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'home_visit', CURRENT_DATE + INTERVAL '1 day', 'Visit home in South Street with digital glucometer and BP cuff.', false, 'synced')
ON CONFLICT (id) DO NOTHING;

-- 11. SEED REFERRALS
INSERT INTO public.referrals (id, patient_id, referring_doctor_id, from_facility_id, to_facility_id, referral_reason, priority, status) VALUES
('60000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 'Specialist Diabetic Retinopathy screening and ophthalmology review', 'Normal', 'Accepted')
ON CONFLICT (id) DO NOTHING;

-- 12. SEED TRANSPORT PROVIDERS (EMERGENCY & RURAL FEEDERS)
INSERT INTO public.transport_providers (id, provider_name, vehicle_type, vehicle_number, contact_phone, village_coverage, district, is_verified) VALUES
('70000001-0000-0000-0000-000000000001', '108 Ambulance Unit (Vadipatti Stand)', 'government_108', 'TN-58-G-1108', '108', 'Alanganallur & Vadipatti Block', 'Madurai', true),
('70000001-0000-0000-0000-000000000002', 'Selvam Rural Community Feeder Van', 'rural_van', 'TN-59-AZ-4102', '+91 98421 99011', 'Alanganallur, Mettupatti, Palamedu', 'Madurai', true),
('70000001-0000-0000-0000-000000000003', 'Ramu Auto Medical Transport', 'auto_ambulance', 'TN-58-BQ-3321', '+91 97892 88123', 'Chellampatti, Usilampatti route', 'Madurai', true)
ON CONFLICT (id) DO NOTHING;

-- 13. SEED HEALTH CAMPS
INSERT INTO public.health_camps (id, title, organizing_facility_id, location_venue, village, district, camp_date, start_time, end_time, services_offered, lead_doctor_id, status, attendees_count) VALUES
('80000001-0000-0000-0000-000000000001', 'Comprehensive Rural Health Screening Camp (கிராமப்புற மருத்துவ முகாம்)', 'b0000001-0000-0000-0000-000000000001', 'Government Higher Secondary School Auditorium', 'Alanganallur', 'Madurai', CURRENT_DATE + INTERVAL '5 days', '08:30:00', '15:00:00', ARRAY['NCD Screening (BP & Sugar)', 'Eye Cataract Exam', 'Maternal Checkup', 'Free Generic Medicines', 'Ayushman ABHA Card Creation'], 'c0000001-0000-0000-0000-000000000001', 'Upcoming', 85)
ON CONFLICT (id) DO NOTHING;

-- 14. SEED QUEUE TOKENS
INSERT INTO public.queue_tokens (facility_id, doctor_id, patient_id, token_number, token_code, status) VALUES
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 14, 'PHC-OPD-014', 'Waiting')
ON CONFLICT (id) DO NOTHING;

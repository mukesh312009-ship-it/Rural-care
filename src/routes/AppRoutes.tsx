import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientLayout } from '../layouts/PatientLayout';
import { DoctorLayout } from '../layouts/DoctorLayout';
import { WorkerLayout } from '../layouts/WorkerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

import { PatientDashboard } from '../pages/PatientDashboard';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { WorkerDashboard } from '../pages/WorkerDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';

import { FacilityFinderPage } from '../pages/FacilityFinderPage';
import { AppointmentPage } from '../pages/AppointmentPage';
import { FollowUpPage } from '../pages/FollowUpPage';
import { MedicationPage } from '../pages/MedicationPage';
import { ReferralPage } from '../pages/ReferralPage';
import { EmergencyPage } from '../pages/EmergencyPage';
import { ProfilePage } from '../pages/ProfilePage';
import { CaregiverPage } from '../pages/CaregiverPage';
import { HealthCampsPage } from '../pages/HealthCampsPage';
import { QueuePage } from '../pages/QueuePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient Portal Layout */}
      <Route element={<PatientLayout />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/facilities" element={<FacilityFinderPage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/medications" element={<MedicationPage />} />
        <Route path="/followups" element={<FollowUpPage />} />
        <Route path="/referrals" element={<ReferralPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/caregivers" element={<CaregiverPage />} />
        <Route path="/health-camps" element={<HealthCampsPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Doctor Portal Layout */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<AppointmentPage />} />
      </Route>

      {/* Community Health Worker Portal Layout */}
      <Route path="/worker" element={<WorkerLayout />}>
        <Route index element={<Navigate to="/worker/dashboard" replace />} />
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="visits" element={<FollowUpPage />} />
        <Route path="register-patient" element={<WorkerDashboard />} />
      </Route>

      {/* Admin Portal Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDashboard />} />
        <Route path="facilities" element={<FacilityFinderPage />} />
        <Route path="appointments" element={<AppointmentPage />} />
        <Route path="camps" element={<HealthCampsPage />} />
        <Route path="audit" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

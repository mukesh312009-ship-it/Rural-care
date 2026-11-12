# 🏥 RuralCare – Healthcare Within Everyone’s Reach

**RuralCare** is a production-oriented, responsive rural healthcare management and coordination platform designed to bridge the healthcare gap in underserved communities by connecting **patients**, **doctors**, **primary health centres (PHCs)**, **community health workers (ASHA/ANM)**, and **family caregivers** through a unified, offline-first system.

---

## 🌟 Key Highlights

- **Bilingual Interface**: Seamlessly toggles between **Tamil (தமிழ்)** and **English**, with Tamil as the primary default.
- **AI Voice Assistant ("RuralCare Assistant")**: Speech recognition & text-to-speech in Tamil (`ta-IN`) and English (`en-IN`) with automatic page navigation and text input fallback.
- **Interactive Facility Finder**: OpenStreetMap & Leaflet mapping with nearby Primary Health Centres, Taluk Hospitals, Sub-Centres, Diagnostic Labs, and Pharmacies.
- **Smart Patient Follow-Up Tracking**: Clinician-defined urgency rules, scheduled ASHA home visit tasks, vitals recording (BP, Blood Sugar, SpO2), and overdue escalation alerts.
- **Offline-First PWA Support**: Service worker caching of app shell & IndexedDB (`idb`) storage for recording visits in low-connectivity rural hamlets with automatic sync queue.
- **Doctor Consultation & Triage**: Medical officer verification badge, appointment approval workflow, prescription builder (Rx), and specialist referrals.
- **Family Caregiver Access**: Granular permission scoping (appointments, medicines, follow-ups) protecting patient privacy.
- **Emergency Transport Coordination**: Direct 112 / 108 integration, verified local feeder vehicle directory, and consent-based GPS coordinate sharing.
- **Smart OPD Queue**: Real-time token display, live calling token counter, and estimated waiting time.
- **Ayushman Bharat (ABDM) Ready**: Modular sandbox layer for 14-digit ABHA ID linking, electronic health record exchange, and consent management.
- **Robust Database & Security**: Complete PostgreSQL schema with 26 tables, foreign key constraints, indexes, and Row Level Security (RLS) policies.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons |
| **Routing & State** | React Router DOM v7, Context API (`AuthContext`, `LanguageContext`) |
| **Maps & Analytics** | Leaflet, OpenStreetMap, Recharts |
| **Internationalization** | i18next, react-i18next (Tamil `ta` & English `en`) |
| **Voice & Speech** | Web Speech Recognition API (`ta-IN`, `en-IN`), SpeechSynthesis API |
| **Offline & Storage** | Progressive Web App (PWA), Service Worker, IndexedDB (`idb`) |
| **Backend & Database**| Supabase, PostgreSQL 15, Row Level Security (RLS) |

---

## 👥 User Roles & Access Hierarchy

The application supports 6 distinct roles with instant 1-click demo switching in the header:

1. **Patient**: Books consultations, receives medicine reminders, tracks follow-up dates, generates OPD tokens, and authorizes caregivers.
2. **Doctor**: Verified medical officers who triage appointments, prescribe medicines, assign follow-up tasks, and dispatch specialist referrals.
3. **Community Health Worker (ASHA / ANM)**: Conducts home visits, records patient vitals with offline IndexedDB storage, tracks overdue cases, and registers new patients.
4. **Family Caregiver**: Authorized by patients with granular permissions to view appointments and help with medications without unrestricted access to clinical records.
5. **Facility Administrator**: Manages PHC operations, facility services, doctor verification queue, and community health camps.
6. **Super Administrator**: State-level health governance, operational analytics charts, and system audit logging.

---

## 📁 Project Folder Structure

```
ruralcare/
├── public/
│   ├── manifest.json                # PWA Web App Manifest
│   ├── sw.js                        # Offline Shell Caching Service Worker
│   ├── pwa-192x192.svg              # App Icon 192px
│   └── pwa-512x512.svg              # App Icon 512px
├── src/
│   ├── assets/                      # Static assets & illustrations
│   ├── components/
│   │   ├── common/                  # OfflineBanner, AccessibilityBar
│   │   ├── navigation/              # Header, RoleSwitcher
│   │   ├── dashboard/               # StatCard, MetricProgress
│   │   ├── forms/                   # FormInput, FormSelect
│   │   └── charts/                  # ConsultationChart, Recharts analytics
│   ├── layouts/
│   │   ├── PatientLayout.tsx        # Patient portal layout & sidebar
│   │   ├── DoctorLayout.tsx         # Clinical officer layout & tools
│   │   ├── WorkerLayout.tsx         # ASHA field worker layout
│   │   └── AdminLayout.tsx          # Health administrator layout
│   ├── pages/
│   │   ├── LandingPage.tsx          # Public showcase & quick demo launch
│   │   ├── LoginPage.tsx            # Multi-role authentication page
│   │   ├── RegisterPage.tsx         # User & clinician registration
│   │   ├── PatientDashboard.tsx     # Patient central view
│   │   ├── DoctorDashboard.tsx      # Clinical consultation & triage
│   │   ├── WorkerDashboard.tsx      # ASHA field visits & offline recorder
│   │   ├── AdminDashboard.tsx       # Analytics & doctor verification
│   │   ├── FacilityFinderPage.tsx   # Interactive Leaflet map & facility directory
│   │   ├── AppointmentPage.tsx      # Booking & appointment status workflow
│   │   ├── FollowUpPage.tsx         # Smart follow-up tracker & visit outcomes
│   │   ├── MedicationPage.tsx       # Medicine reminders & dose logging
│   │   ├── ReferralPage.tsx         # Inter-facility specialist referrals
│   │   ├── EmergencyPage.tsx        # 112 / 108 hotlines & feeder vehicles
│   │   ├── CaregiverPage.tsx        # Scoped caregiver permissions
│   │   ├── HealthCampsPage.tsx      # Community screening camp registry
│   │   ├── QueuePage.tsx            # Live OPD token display board
│   │   └── ProfilePage.tsx          # Health profile & ABDM ABHA sandbox
│   ├── features/                    # Domain-driven feature modules
│   │   ├── voice-assistant/         # Web Speech API & Tamil voice processor
│   │   ├── facilities/              # Leaflet mapping component
│   │   ├── followups/               # Urgency rules & outcome badges
│   │   ├── health-workers/          # ASHA offline sync queue
│   │   └── queue-management/        # OPD queue caller
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Role switcher & session state
│   │   └── LanguageContext.tsx      # Tamil/English & large font accessibility
│   ├── locales/
│   │   ├── en/translation.json      # English translations
│   │   ├── ta/translation.json      # Tamil (தமிழ்) translations
│   │   └── i18n.ts                  # i18next initialization
│   ├── lib/
│   │   └── supabase.ts              # Supabase client with offline fallback
│   ├── services/
│   │   ├── mockDataService.ts       # Realistic Tamil Nadu seed datasets
│   │   ├── dataService.ts           # Unified reactive data repository
│   │   └── offlineStorage.ts        # IndexedDB storage using 'idb'
│   ├── routes/
│   │   └── AppRoutes.tsx            # Protected role-based routing
│   ├── types/
│   │   └── index.ts                 # Full domain TypeScript declarations
│   ├── App.tsx                      # Root application wrapper
│   ├── main.tsx                     # Vite React entry point
│   └── index.css                    # Tailwind CSS & accessible text styles
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql   # PostgreSQL migration (26 tables + RLS)
│   ├── functions/                   # Supabase edge functions
│   └── seed.sql                     # Realistic fictional seed data
├── .env.example                     # Environment template
├── package.json
├── tailwind.config.js               # Teal & Healthcare Blue palette
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Clone and Install Dependencies
```bash
# Navigate to project directory
cd "c:\Users\ADMIN\Downloads\DT Farmer"

# Install packages
npm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
*(Note: A development fallback is enabled by default so the application runs immediately without requiring live Supabase credentials).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Setup (Supabase)

To link with a live Supabase PostgreSQL project:
1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, execute `supabase/migrations/001_initial_schema.sql`.
3. Next, execute `supabase/seed.sql` to populate sample PHCs, verified doctors, and ASHA workers.
4. Copy your **Project URL** and **Anon Key** into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 🎙️ RuralCare AI Voice Assistant Commands

Click the microphone button in the header or in any dashboard to speak or type in Tamil or English:

| Voice Query (Tamil / English) | Action Triggered |
|---|---|
| *"அருகிலுள்ள அரசு மருத்துவமனை எங்கே?"* / *"Where is the nearest hospital?"* | Navigates to `/facilities`, speaks nearest PHC address |
| *"எனக்கு ஒரு appointment book செய்ய வேண்டும்."* / *"Book doctor appointment"* | Opens `/appointments` booking workflow |
| *"என்னுடைய அடுத்த appointment எப்போது?"* / *"When is my next appointment?"* | Reads out upcoming appointment date and time |
| *"எனக்கு மருந்து நினைவூட்டலைக் காட்டு."* / *"Show my medicines"* | Opens `/medications` and speaks today's schedule |
| *"அவசர ஆம்புலன்ஸ் உதவி தேவை"* / *"Emergency ambulance"* | Dispatches user to `/emergency` with 112 / 108 dials |

---

## 🛡️ Privacy, Security & Disclaimers

1. **Medical Advice Disclaimer**: RuralCare is a coordination and scheduling platform. It does not provide automated clinical diagnosis or recommend medications.
2. **Emergency Disclaimer**: RuralCare is not a primary emergency dispatch service. For life-threatening emergencies, patients are instructed to dial **108** or **112** directly.
3. **ABDM Sandbox Disclaimer**: All ABHA IDs and digital health records are simulated in a development sandbox environment until formal government integration credentials are provisioned.
4. **Data Isolation**: Family caregivers receive strictly scoped permissions and never have access to full clinical encounter notes without direct patient consent.

---

## 📜 License
Developed for rural community healthcare enablement under the **RuralCare Initiative**. Open for educational and community development use.

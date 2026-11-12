import { LanguageCode } from '../../types';
import { dataService } from '../../services/dataService';

export interface VoiceAssistantResponse {
  spokenReply: string;
  displayReply: string;
  navigateRoute?: string;
  category: 'facility' | 'appointment' | 'medication' | 'followup' | 'emergency' | 'general';
}

export function processVoiceQuery(query: string, lang: LanguageCode): VoiceAssistantResponse {
  const q = query.toLowerCase().trim();

  // 1. Emergency Queries
  if (
    q.includes('அவசரம்') ||
    q.includes('ஆம்புலன்ஸ்') ||
    q.includes('108') ||
    q.includes('112') ||
    q.includes('emergency') ||
    q.includes('ambulance') ||
    q.includes('urgent')
  ) {
    return {
      category: 'emergency',
      navigateRoute: '/emergency',
      spokenReply:
        lang === 'ta'
          ? 'அவசர உதவிக்கு உடனடியாக 108 அல்லது 112 அழைக்கவும். இப்போது அவசர உதவி பக்கத்திற்கு மாற்றுகிறேன்.'
          : 'For immediate emergency assistance, call 108 or 112. Navigating to the Emergency Coordination page now.',
      displayReply:
        lang === 'ta'
          ? '🚨 அவசர உதவிக்கு 108 (ஆம்புலன்ஸ்) அல்லது 112 அழையுங்கள். அவசர உதவிப் பக்கம் திறக்கப்படுகிறது.'
          : '🚨 Call 108 or 112 immediately. Opening Emergency Transport Coordination.',
    };
  }

  // 2. Facility Search / Hospital Queries
  if (
    q.includes('மருத்துவமனை') ||
    q.includes('phc') ||
    q.includes('ஆரம்ப சுகாதார') ||
    q.includes('மருந்தகம்') ||
    q.includes('hospital') ||
    q.includes('facility') ||
    q.includes('clinic') ||
    q.includes('pharmacy') ||
    q.includes('doctor near')
  ) {
    const facilities = dataService.getFacilities();
    const nearest = facilities[0];
    return {
      category: 'facility',
      navigateRoute: '/facilities',
      spokenReply:
        lang === 'ta'
          ? `உங்களுக்கு மிக அருகில் உள்ளது ${nearest.name}. இது ${nearest.distance_km} கிலோமீட்டர் தொலைவில் உள்ளது. மருத்துவமனைகள் வரைபடத்தை காட்டுகிறேன்.`
          : `The nearest facility is ${nearest.name}, approximately ${nearest.distance_km} kilometers away. Opening the facility finder now.`,
      displayReply:
        lang === 'ta'
          ? `🏥 உங்களுக்கு அருகிலுள்ள சுகாதார மையம்: **${nearest.name}** (${nearest.distance_km} கி.மீ). முழுமையான வரைபடம் மற்றும் பட்டியல் திறக்கப்படுகிறது.`
          : `🏥 Nearest Facility: **${nearest.name}** (~${nearest.distance_km} km). Opening interactive facility finder.`,
    };
  }

  // 3. Appointments Queries
  if (
    q.includes('appointment') ||
    q.includes('முன்பதிவு') ||
    q.includes('நேரம் ஒதுக்கு') ||
    q.includes('டாக்டரை பார்க்க') ||
    q.includes('book') ||
    q.includes('consultation')
  ) {
    const appointments = dataService.getAppointments();
    const upcoming = appointments.find((a) => a.status === 'Confirmed' || a.status === 'Requested');
    if (q.includes('அடுத்த') || q.includes('next') || q.includes('when') || q.includes('எப்போது')) {
      if (upcoming) {
        return {
          category: 'appointment',
          navigateRoute: '/appointments',
          spokenReply:
            lang === 'ta'
              ? `உங்களுடைய அடுத்த மருத்துவ முன்பதிவு ${upcoming.appointment_date} அன்று காலை ${upcoming.time_slot}-க்கு ${upcoming.doctor_name}-உடன் திட்டமிடப்பட்டுள்ளது.`
              : `Your next appointment is scheduled on ${upcoming.appointment_date} at ${upcoming.time_slot} with ${upcoming.doctor_name}.`,
          displayReply:
            lang === 'ta'
              ? `📅 உங்கள் அடுத்த முன்பதிவு: **${upcoming.appointment_date}** (${upcoming.time_slot}) - ${upcoming.doctor_name}.`
              : `📅 Next Appointment: **${upcoming.appointment_date}** at ${upcoming.time_slot} with ${upcoming.doctor_name}.`,
        };
      }
    }
    return {
      category: 'appointment',
      navigateRoute: '/appointments',
      spokenReply:
        lang === 'ta'
          ? 'மருத்துவரை சந்திக்க முன்பதிவு செய்ய விரும்புகிறீர்கள். முன்பதிவு பக்கத்திற்கு அழைத்துச் செல்கிறேன்.'
          : 'Taking you to the appointment booking page where you can choose a facility and time slot.',
      displayReply:
        lang === 'ta'
          ? '📅 முன்பதிவுப் பக்கம் திறக்கப்படுகிறது. நீங்கள் விரும்பும் தேதி மற்றும் நேரத்தை தேர்வு செய்யலாம்.'
          : '📅 Opening appointment booking. Select your preferred facility, doctor, and slot.',
    };
  }

  // 4. Medication Reminders Queries
  if (
    q.includes('மருந்து') ||
    q.includes('மாத்திரை') ||
    q.includes('medicine') ||
    q.includes('medication') ||
    q.includes('pill') ||
    q.includes('remind') ||
    q.includes('நினைவூட்டல்')
  ) {
    const meds = dataService.getMedications();
    return {
      category: 'medication',
      navigateRoute: '/medications',
      spokenReply:
        lang === 'ta'
          ? `உங்களுக்கு தற்போது ${meds.length} மருந்துகள் பரிந்துரைக்கப்பட்டுள்ளன. இதில் மெட்ஃபோர்மின் காலை மற்றும் இரவு உணவுக்கு பின் உட்கொள்ள வேண்டும். மருந்து அட்டவணைப் பக்கத்திற்கு செல்கிறேன்.`
          : `You currently have ${meds.length} active medications, including Metformin twice daily. Opening your medication schedule.`,
      displayReply:
        lang === 'ta'
          ? `💊 உங்களுக்கு ${meds.length} மருந்துகள் உள்ளன. உங்கள் மருந்து நினைவூட்டல் அட்டவணை திறக்கப்படுகிறது.`
          : `💊 You have ${meds.length} active prescriptions. Opening medicine reminders.`,
    };
  }

  // 5. Follow-ups Queries
  if (
    q.includes('தொடர்') ||
    q.includes('பரிசோதனை') ||
    q.includes('ஆஷா') ||
    q.includes('follow') ||
    q.includes('asha') ||
    q.includes('worker') ||
    q.includes('home visit')
  ) {
    const followUps = dataService.getFollowUps();
    const due = followUps.find((f) => f.status === 'Due' || f.status === 'Upcoming');
    return {
      category: 'followup',
      navigateRoute: '/followups',
      spokenReply:
        lang === 'ta'
          ? `உங்களுக்கான தொடர் இரத்த அழுத்த பரிசோதனை ${due?.target_date || 'விரைவில்'} திட்டமிடப்பட்டுள்ளது. ஆஷா களப்பணியாளர் தொடர்பு கொள்வார்.`
          : `You have a scheduled follow-up check on ${due?.target_date || 'soon'}. Community health worker will assist you.`,
      displayReply:
        lang === 'ta'
          ? `📋 ஸ்மார்ட் தொடர் கண்காணிப்புப் பக்கம் திறக்கப்படுகிறது. ஆஷா களப்பணியாளரின் பணிப் பட்டியல் இதில் உள்ளது.`
          : `📋 Opening Smart Follow-Up Tracking dashboard.`,
    };
  }

  // Fallback safe conversational guidance
  return {
    category: 'general',
    spokenReply:
      lang === 'ta'
        ? 'நான் ரூரல்கேர் உதவியாளர். மருத்துவமனைகளை கண்டறிய, முன்பதிவு செய்ய அல்லது மருந்து நினைவூட்டல்களை அறிய என்னிடம் கேளுங்கள்.'
        : 'I am RuralCare Assistant. You can ask me to find nearby hospitals, book doctor appointments, or check your medicine schedule.',
    displayReply:
      lang === 'ta'
        ? '🤖 **ரூரல்கேர் குரல் உதவியாளர்**: அருகிலுள்ள மருத்துவமனைகளை கண்டறிய, முன்பதிவு செய்ய, அல்லது மருந்து நேரங்களை அறிய கேளுங்கள்.'
        : '🤖 **RuralCare Voice Assistant**: Ask me to find PHCs, check upcoming appointments, or view your medicines.',
  };
}

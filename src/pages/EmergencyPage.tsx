import React, { useState } from 'react';
import {
  PhoneCall,
  Ambulance,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Navigation,
  ExternalLink,
  Car,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { TransportProvider, EmergencyRequest } from '../types';

export const EmergencyPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const transportProviders = dataService.getTransportProviders();
  const [requests, setRequests] = useState<EmergencyRequest[]>(() => dataService.getEmergencyRequests());

  // Form State
  const [contactName, setContactName] = useState(user?.full_name || 'Muthuvel Karuppan');
  const [contactPhone, setContactPhone] = useState(user?.phone_number || '+91 98421 11201');
  const [village, setVillage] = useState('Alanganallur');
  const [district, setDistrict] = useState('Madurai');
  const [emergencyType, setEmergencyType] = useState('cardiac_chest_pain');
  const [locationConsent, setLocationConsent] = useState(true);
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number } | null>({
    lat: 10.0436,
    lng: 78.0838,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq = dataService.submitEmergencyRequest({
      contact_name: contactName,
      contact_phone: contactPhone,
      village,
      district,
      emergency_type: emergencyType,
      gps_latitude: currentGps?.lat,
      gps_longitude: currentGps?.lng,
    });

    setRequests(dataService.getEmergencyRequests());
    setSuccessToast(
      language === 'ta'
        ? 'அவசர போக்குவரத்து கோரிக்கை பதிவு செய்யப்பட்டது! உள்ளூர் ஒருங்கிணைப்பாளர் தொடர்பு கொள்வார்.'
        : 'Emergency transport request submitted! Local coordinator alerted.'
    );
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-teal-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Official Emergency Disclaimer */}
      <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-3xl text-rose-900 shadow-sm flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-rose-800">
            {language === 'ta' ? 'அவசர கால முக்கிய அறிவிப்பு (Emergency Notice)' : 'Official Emergency Protocol'}
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-rose-900">
            {language === 'ta'
              ? 'ரூரல்கேர் என்பது கிராமப்புற போக்குவரத்து ஒருங்கிணைப்புக்கான தளம் மட்டுமே. உயிருக்கு ஆபத்தான அவசர காலங்களில் தாமதிக்காமல் உடனடியாக 108 (இலவச அரசு ஆம்புலன்ஸ்) அல்லது 112 அழைக்கவும்.'
              : 'RuralCare facilitates community medical transport coordination. It is NOT an emergency dispatch service. For life-threatening emergencies, call 108 or 112 immediately without delay.'}
          </p>
        </div>
      </div>

      {/* Emergency Hotlines Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* National Emergency 112 */}
        <a
          href="tel:112"
          className="p-6 rounded-3xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-xl hover:shadow-rose-200 transition transform hover:-translate-y-0.5 flex items-center justify-between group"
        >
          <div>
            <span className="text-xs uppercase font-bold text-rose-200 tracking-wider">
              {language === 'ta' ? 'தேசிய அவசர உதவி' : 'All-India Emergency'}
            </span>
            <div className="text-4xl font-black mt-1 tracking-tight">112</div>
            <p className="text-xs text-rose-100 mt-1">
              {language === 'ta' ? 'காவல்துறை / தீயணைப்பு / ஆம்புலன்ஸ்' : 'Police / Fire / Medical Dispatch'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition">
            <PhoneCall className="w-8 h-8 animate-bounce" />
          </div>
        </a>

        {/* 108 Free Ambulance */}
        <a
          href="tel:108"
          className="p-6 rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-xl hover:shadow-teal-200 transition transform hover:-translate-y-0.5 flex items-center justify-between group"
        >
          <div>
            <span className="text-xs uppercase font-bold text-teal-200 tracking-wider">
              {language === 'ta' ? 'தமிழ்நாடு அரசு இலவச ஆம்புலன்ஸ்' : 'State Ambulance Helpline'}
            </span>
            <div className="text-4xl font-black mt-1 tracking-tight">108</div>
            <p className="text-xs text-teal-100 mt-1">
              {language === 'ta' ? 'அவசர சிகிச்சை ஊர்தி சேவை (24x7)' : 'Toll-free 24x7 Medical Response'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition">
            <Ambulance className="w-8 h-8" />
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Request Rural Transport Assistance */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'ta' ? 'கிராமப்புற அவசர வாகன உதவி கோரிக்கை' : 'Request Rural Transport Coordination'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ta'
                  ? 'அருகிலுள்ள சரிபார்க்கப்பட்ட வாகன ஓட்டுநர் மற்றும் ஆஷா பணியாளரை ஒருங்கிணைக்க.'
                  : 'Coordinate with verified community feeder vehicles and health post ambulances.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleEmergencySubmit} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'தொடர்பு கொள்ள வேண்டிய பெயர்:' : 'Contact Name:'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'கைபேசி எண்:' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'கிராமம் / ஊர்:' : 'Village / Ward:'}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'அவசர வகை:' : 'Nature of Emergency:'}
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="cardiac_chest_pain">Chest Pain / Cardiac Symptoms</option>
                  <option value="maternal_labor">Maternal Labor / Delivery</option>
                  <option value="trauma_injury">Trauma / Road Accident / Snakebite</option>
                  <option value="fever_convulsion">High Fever with Convulsion</option>
                  <option value="other">Other Severe Distress</option>
                </select>
              </div>
            </div>

            {/* GPS Sharing with Consent */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={locationConsent}
                    onChange={(e) => setLocationConsent(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    {language === 'ta' ? 'அவசர வாகனத்திற்கு GPS இருப்பிடத்தை பகிர சம்மதிக்கிறேன்' : 'Consent to share GPS location for vehicle routing'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleShareLocation}
                  disabled={!locationConsent || isLocating}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg text-teal-700 font-semibold hover:bg-slate-100 flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
                </button>
              </div>

              {currentGps && (
                <p className="text-[11px] text-teal-800 font-medium">
                  📍 GPS Coordinates: {currentGps.lat.toFixed(4)}, {currentGps.lng.toFixed(4)} (Alanganallur Block)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-rose-100"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ta' ? 'அவசர வாகன ஒருங்கிணைப்பை தொடங்குக' : 'Submit Transport Assistance Request'}</span>
            </button>
          </form>

          {/* Active Requests Status */}
          {requests.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'ta' ? 'உங்கள் அண்மைக்கால அவசர கோரிக்கைகள்:' : 'Active Emergency Requests:'}
              </h3>
              {requests.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900">{r.contact_name}</span> – {r.village} ({r.emergency_type})
                    <p className="text-[11px] text-slate-500 mt-0.5">{new Date(r.created_at).toLocaleTimeString()}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-amber-200 text-amber-900 text-[11px]">
                    Status: {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Verified Local Transport Provider Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-teal-600" />
              <span>
                {language === 'ta' ? 'சரிபார்க்கப்பட்ட உள்ளூர் வாகனங்கள்' : 'Verified Local Transport Contacts'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'ta'
                ? 'கிராமப்புற அவசர போக்குவரத்துக்காக வட்டார அளவில் பதிவு செய்யப்பட்ட வாகனங்கள்.'
                : 'Block-level feeder transport providers for rural connectivity.'}
            </p>

            <div className="space-y-3 pt-1">
              {transportProviders.map((tp) => (
                <div key={tp.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-200 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{tp.provider_name}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{tp.village_coverage}</span>
                      </p>
                      {tp.vehicle_number && (
                        <span className="inline-block mt-1 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {tp.vehicle_number}
                        </span>
                      )}
                    </div>

                    <a
                      href={`tel:${tp.contact_phone}`}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{tp.contact_phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

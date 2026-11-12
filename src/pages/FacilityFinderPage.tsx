import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  ExternalLink,
  Calendar,
  Building2,
  Navigation,
  ShieldCheck,
  Filter,
  Info,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { dataService } from '../services/dataService';
import { Facility, FacilityType } from '../types';
import { FacilityMap } from '../features/facilities/FacilityMap';

export const FacilityFinderPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  const facilities = dataService.getFacilities();

  // Filter logic
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchesSearch =
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.pincode.includes(searchQuery);

      const matchesType = selectedType === 'all' || fac.facility_type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [facilities, searchQuery, selectedType]);

  const facilityTypes: { key: string; ta: string; en: string }[] = [
    { key: 'all', ta: 'அனைத்தும்', en: 'All' },
    { key: 'phc', ta: 'ஆரம்ப சுகாதாரம் (PHC)', en: 'PHC' },
    { key: 'government_hospital', ta: 'அரசு மருத்துவமனை', en: 'Govt Hospital' },
    { key: 'chc', ta: 'சமூக சுகாதார மையம் (CHC)', en: 'CHC' },
    { key: 'sub_centre', ta: 'துணை நிலையம் (HSC)', en: 'Sub-Centre' },
    { key: 'diagnostic_centre', ta: 'பரிசோதனை கூடம்', en: 'Diagnostic Lab' },
    { key: 'pharmacy', ta: 'மருந்தகம்', en: 'Pharmacy' },
  ];

  const handleBookAtFacility = (facility: Facility) => {
    navigate(`/appointments?facilityId=${facility.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அரசு & கிராமப்புற சுகாதாரக் கட்டமைப்பு' : 'Rural Health Infrastructure'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ta' ? 'கிராமப்புற சுகாதார மையங்கள் & மருந்தகங்கள்' : 'Healthcare Facility Finder'}
          </h1>
          <p className="mt-2 text-teal-100 text-sm sm:text-base leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் கிராமம் மற்றும் வட்டாரத்தில் உள்ள ஆரம்ப சுகாதார நிலையங்கள் (PHC), அரசு மருத்துவமனைகள் மற்றும் மருந்தகங்களை வரைபடத்தில் கண்டறியவும்.'
              : 'Discover Primary Health Centres, Taluk Hospitals, Sub-Centres, and Rural Pharmacies with verified contact numbers and operating hours.'}
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'கிராமம், நகரம் அல்லது அஞ்சல் குறியீடு (எ.கா. Alanganallur, 625501)...'
                    : 'Search by village, town, or PIN code (e.g. Alanganallur, 625501)...'
                }
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Background Emblem */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none">
          <Building2 className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Filter Tabs & View Toggles */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {facilityTypes.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedType(t.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedType === t.key
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ta' ? t.ta : t.en}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-1 rounded-xl self-end md:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'split' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            {language === 'ta' ? 'இருபக்க பார்வை' : 'Split View'}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'map' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            {language === 'ta' ? 'வரைபடம்' : 'Map Only'}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'list' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            {language === 'ta' ? 'பட்டியல்' : 'List Only'}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : viewMode === 'map'
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {/* Left Column / List View */}
        {viewMode !== 'map' && (
          <div
            className={`space-y-4 ${
              viewMode === 'split' ? 'lg:col-span-5 max-h-[720px] overflow-y-auto pr-1' : ''
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>{filteredFacilities.length} {language === 'ta' ? 'நிலையங்கள் கண்டறியப்பட்டன' : 'Facilities Found'}</span>
              <span className="flex items-center gap-1 text-teal-700">
                <Info className="w-3.5 h-3.5" /> Sample Demo Data Labeled
              </span>
            </div>

            {filteredFacilities.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 font-semibold text-sm">
                  {language === 'ta' ? 'பொருத்தமான நிலையங்கள் இல்லை' : 'No facilities found'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'ta' ? 'வேறு தேடல் சொல்லை முயற்சிக்கவும்.' : 'Try adjusting your search or filter.'}
                </p>
              </div>
            ) : (
              filteredFacilities.map((fac) => {
                const isSelected = selectedFacility?.id === fac.id;
                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                      isSelected ? 'border-teal-600 ring-2 ring-teal-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                            {fac.facility_type.replace('_', ' ')}
                          </span>
                          {fac.is_verified && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <CheckCircle className="w-3 h-3" />
                              {language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                            </span>
                          )}
                          {fac.is_sample_data && (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              Demo
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-teal-600">
                          {fac.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span>{fac.address}, {fac.village} – {fac.pincode}</span>
                        </p>
                      </div>

                      {fac.distance_km && (
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-black text-teal-700">~{fac.distance_km}</span>
                          <span className="text-[10px] text-slate-500 block">km</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span className="truncate max-w-[200px]">{fac.operating_hours}</span>
                      </div>

                      <a
                        href={`tel:${fac.contact_phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{fac.contact_phone}</span>
                      </a>
                    </div>

                    {/* Booking & Direction Buttons */}
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookAtFacility(fac);
                        }}
                        className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'முன்பதிவு செய்' : 'Book Appointment'}</span>
                      </button>

                      <a
                        href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${fac.latitude}%2C${fac.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        title="Get directions on OpenStreetMap"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{language === 'ta' ? 'வழி' : 'Directions'}</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Right Column / Map View */}
        {viewMode !== 'list' && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-7 h-[680px]' : 'h-[620px]'}`}>
            <FacilityMap
              facilities={filteredFacilities}
              selectedFacility={selectedFacility}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

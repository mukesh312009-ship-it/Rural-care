import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Facility } from '../../types';

interface FacilityMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
}

export const FacilityMap: React.FC<FacilityMapProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Custom Teal Pin Icon for facilities
    const defaultIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: #0d9488; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🏥</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const activeIcon = L.divIcon({
      className: 'custom-map-marker-active',
      html: `<div style="background-color: #ef4444; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 10px rgba(239,68,68,0.5);">📍</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    // Default center on Madurai rural cluster (10.0436, 78.0838)
    const initialLat = selectedFacility?.latitude || 10.0436;
    const initialLng = selectedFacility?.longitude || 78.0838;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add facility markers
    facilities.forEach((fac) => {
      const isSelected = selectedFacility?.id === fac.id;
      const marker = L.marker([fac.latitude, fac.longitude], {
        icon: isSelected ? activeIcon : defaultIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #0f766e; font-size: 13px;">${fac.name}</strong><br/>
          <span style="color: #64748b;">${fac.address}, ${fac.village}</span><br/>
          <strong style="color: #0369a1;">📞 ${fac.contact_phone}</strong><br/>
          <span style="display:inline-block; margin-top:4px; padding: 2px 6px; background:#f1f5f9; border-radius:4px; font-size:10px;">
            ${fac.operating_hours}
          </span>
        </div>
      `);

      marker.on('click', () => {
        onSelectFacility(fac);
      });

      markersRef.current.push(marker);
    });

    if (selectedFacility) {
      map.flyTo([selectedFacility.latitude, selectedFacility.longitude], 14, { duration: 1 });
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, [facilities, selectedFacility, onSelectFacility]);

  // Handle container unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[380px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
        <span>OpenStreetMap Live Data</span>
      </div>
    </div>
  );
};

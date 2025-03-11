"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default icon in Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Types for component props
interface LeafletMapProps {
  districtData: any;
  selectedDistrict: string | null;
  onDistrictClick: (districtName: string) => void;
}

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  districtData, 
  selectedDistrict, 
  onDistrictClick 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  
  // Set Bangladesh center coordinates
  const position: [number, number] = [23.8103, 90.4125];
  
  useEffect(() => {
    // Fit map to Bangladesh bounds when component mounts
    if (mapRef.current) {
      mapRef.current.fitBounds([
        [20.7, 88.0], // Southwest coordinates
        [26.6, 92.7]  // Northeast coordinates
      ]);
    }
  }, []);

  // Style function for the districts
  const districtStyle = (feature: any) => {
    const isSelected = selectedDistrict === feature.properties?.NAME_2;
    return {
      fillColor: isSelected ? '#3b82f6' : '#86efac',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: 'white',
      fillOpacity: isSelected ? 0.7 : 0.5,
    };
  };

  // Handle each district feature
  const onEachDistrict = (feature: any, layer: L.Layer) => {
    if (!feature.properties) return;
    
    const districtName = feature.properties.NAME_2 || feature.properties.name_en || '';
    
    // Add tooltip with district name
    if (districtName) {
      layer.bindTooltip(districtName, {
        permanent: false,
        direction: 'center',
        className: 'bg-white px-2 py-1 rounded shadow-sm text-sm'
      });
    }
    
    // Add click handler
    layer.on({
      click: () => {
        if (districtName) {
          onDistrictClick(districtName);
        }
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#9ca3af',
          fillOpacity: 0.8,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(districtStyle(feature));
      }
    });
  };

  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={districtData}
        style={districtStyle}
        onEachFeature={onEachDistrict}
      />
    </MapContainer>
  );
};

export default LeafletMap;
"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Types for the component props
interface DistrictMapProps {
  height?: string;
  selectedDistrict?: string | null;
  onDistrictClick: (districtName: string) => void;
}

// Import the GeoJSON data
import districtData from '../../../Data/gadm41_BGD_2.json';

// Define the props for the Map component
interface MapProps {
  districtData: any; // Replace 'any' with a more specific type if possible
  selectedDistrict?: string | null;
  onDistrictClick: (districtName: string) => void;
}

// Create a client-side only component for the map
const Map = dynamic(
  () => import('./LeafletMap'),
  {
    loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>,
    ssr: false // Disable server-side rendering
  }
);

const DistrictMap: React.FC<DistrictMapProps> = ({ 
  height = '600px', 
  selectedDistrict = null, 
  onDistrictClick 
}) => {
  return (
    <div className="district-map-container" style={{ height, width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <Map 
        districtData={districtData} 
        selectedDistrict={selectedDistrict} 
        onDistrictClick={onDistrictClick}
      />
    </div>
  );
};

export default DistrictMap;
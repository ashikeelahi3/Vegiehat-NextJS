"use client";

import { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, ZoomControl } from 'react-leaflet';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Set Bangladesh center coordinates
  const position: [number, number] = [23.8103, 90.4125];
  
  // Function to toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => {
            setIsFullScreen(true);
            // Invalidate map size after entering fullscreen and reposition controls
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.invalidateSize();
                // Ensure zoom controls are visible
                const zoomControl = document.querySelector('.leaflet-control-zoom');
                if (zoomControl) {
                  (zoomControl as HTMLElement).style.display = 'block';
                }
              }
            }, 100);
          })
          .catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullScreen(false);
            // Invalidate map size after exiting fullscreen
            setTimeout(() => {
              mapRef.current?.invalidateSize();
            }, 100);
          })
          .catch(err => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`);
          });
      }
    }
  };
  
  // Listen for fullscreenchange event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      // Invalidate map size when fullscreen changes
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  useEffect(() => {
    // Fit map to Bangladesh bounds when component mounts
    if (mapRef.current) {
      mapRef.current.fitBounds([
        [20.7, 88.0], // Southwest coordinates
        [26.6, 92.7]  // Northeast coordinates
      ]);
      
      // Set min/max zoom constraints after map is initialized
      mapRef.current.setMinZoom(6);  // Prevent zooming out too far
      mapRef.current.setMaxZoom(12); // Allow more zoom for details
      
      // Enable scroll wheel zoom by default
      mapRef.current.scrollWheelZoom.enable();
      
      // Add a info tooltip about zooming
      const zoomInfo = new L.Control({ position: 'bottomleft' });
      zoomInfo.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        div.innerHTML = `<div class="bg-white dark:bg-gray-800 px-3 py-2 rounded-md text-xs text-gray-600 dark:text-gray-300 shadow-sm">
          <strong>Tip:</strong> Use scroll wheel to zoom
        </div>`;
        return div;
      };
      zoomInfo.addTo(mapRef.current);
      
      // Position fullscreen button away from zoom controls
      // We'll use a standalone button instead of a Leaflet control
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
    <div 
      ref={containerRef} 
      className={`map-container relative ${isFullScreen ? 'fullscreen-map' : ''}`} 
      style={{ height: '100%', width: '100%' }}
    >
      <MapContainer
        center={position}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        minZoom={6}
        maxZoom={12}
        scrollWheelZoom={true} // Enable scroll wheel zoom
        zoomControl={true} // Show default zoom controls
        attributionControl={true}
        doubleClickZoom={true}
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
      
      {/* Standalone fullscreen button - positioned away from zoom controls */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-4 right-16 z-50 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md shadow-md"
        title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullScreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        )}
      </button>
      
      {/* Add a fullscreen indicator when in fullscreen mode */}
      {isFullScreen && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-md text-xs text-gray-600 dark:text-gray-300 shadow-md">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Fullscreen mode - Press ESC to exit
          </p>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
"use client";

import { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X } from 'lucide-react';
import DistrictReportContent from './DistrictReportContent';

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
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);

  const position: [number, number] = [23.8103, 90.4125];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => {
            setIsFullScreen(true);
            document.body.classList.add('has-fullscreen-map');
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.invalidateSize();
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
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullScreen(false);
            document.body.classList.remove('has-fullscreen-map');
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

  const handleDistrictClick = (districtName: string) => {
    setActiveDistrict(districtName);
    setIsDistrictModalOpen(true);
  };

  const closeDistrictModal = () => {
    setIsDistrictModalOpen(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
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
    if (mapRef.current) {
      mapRef.current.fitBounds([
        [20.7, 88.0],
        [26.6, 92.7]
      ]);
      mapRef.current.setMinZoom(6);
      mapRef.current.setMaxZoom(12);
      mapRef.current.scrollWheelZoom.enable();
    }
  }, []);

  const districtStyle = (feature: any) => {
    const isSelected = selectedDistrict === feature.properties?.NAME_2;
    return {
      fillColor: isSelected ? '#3b82f6' : '#86efac',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : 'white',
      fillOpacity: isSelected ? 0.7 : 0.5,
      interactive: true,
      bubblingMouseEvents: false,
      className: 'district-path'
    };
  };

  const onEachDistrict = (feature: any, layer: L.Layer) => {
    if (!feature.properties) return;

    const districtName = feature.properties.NAME_2 || feature.properties.name_en || '';

    if (districtName) {
      layer.bindTooltip(districtName, {
        permanent: false,
        direction: 'center',
        className: 'bg-white px-2 py-1 shadow-sm text-sm'
      });
    }

    layer.on({
      click: () => {
        if (districtName) {
          handleDistrictClick(districtName);
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
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
        doubleClickZoom={true}
        className="outline-none focus:outline-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={districtData}
          style={districtStyle}
          onEachFeature={onEachDistrict}
          pathOptions={{ className: 'outline-none focus:outline-none' }}
        />
      </MapContainer>
      
      {/* Standalone fullscreen button - positioned in top right corner */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 z-30 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md shadow-md"
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

      {/* District Report Modal - with higher z-index */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 z-[1000] fullscreen-map-report flex items-center justify-center p-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full h-full sm:w-auto sm:h-auto sm:max-w-5xl sm:max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeDistrict} District Price Data
              </h3>
              <button 
                onClick={closeDistrictModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <DistrictReportContent 
                districtName={activeDistrict}
                inModal={true}
              />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
              <button
                onClick={closeDistrictModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .leaflet-container {
          outline: none !important;
          z-index: 20 !important; /* Lower than navbar */
        }
        
        .leaflet-interactive {
          outline: none !important;
        }
        
        /* Remove focus rectangles from SVG paths */
        path.district-path {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Fix for Firefox focus styles */
        .leaflet-container:focus,
        .leaflet-container *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Fix for z-index issues */
        .leaflet-pane {
          z-index: 10 !important;
        }
        
        .leaflet-top, 
        .leaflet-bottom {
          z-index: 20 !important;
        }
        
        /* This is crucial - set map control z-index lower than navbar */
        .leaflet-control {
          z-index: 30 !important;
        }
        
        /* Make sure the fullscreen map is below modals */
        .fullscreen-map {
          position: fixed !important;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 40 !important;
          background: white;
        }
        
        /* Ensure the modal always appears above EVERYTHING */
        .fixed {
          z-index: 9999 !important;
        }
        
        /* Specific class for the district modal */
        .fullscreen-map-report {
          z-index: 9999 !important;
          position: fixed !important;
        }
        
        /* Override any other z-index that might interfere */
        #__next {
          z-index: auto !important;
        }
        
        /* Ensure body doesn't hide modals */
        body.has-fullscreen-map::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9000;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
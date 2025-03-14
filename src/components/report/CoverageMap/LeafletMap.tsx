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
  const [activeFeature, setActiveFeature] = useState<any>(null);
  
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
            // Add class to body to prevent scrolling
            document.body.classList.add('has-fullscreen-map');
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
            // Remove class from body to restore scrolling
            document.body.classList.remove('has-fullscreen-map');
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
      
      // Remove focus outline from the map container
      mapRef.current.getContainer().style.outline = 'none';
    }
  }, []);

  // Style function for the districts
  const districtStyle = (feature: any) => {
    const isSelected = selectedDistrict === feature.properties?.NAME_2;
    return {
      fillColor: isSelected ? '#3b82f6' : '#86efac',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1e40af' : 'white', // Change border color for selected district
      fillOpacity: isSelected ? 0.7 : 0.5,
      // Remove default focus styles
      interactive: true, 
      bubblingMouseEvents: false,
      className: 'district-path'
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
        className: 'bg-white px-2 py-1 shadow-sm text-sm'
      });
    }
    
    // Remove the default focus rectangle
    const pathLayer = layer as L.Path;
    if (pathLayer.getElement) {
      const pathElement = pathLayer.getElement();
      if (pathElement) {
        pathElement.setAttribute('tabindex', '-1'); // Remove from tab order
        (pathElement as HTMLElement).style.outline = 'none'; // Remove outline
      }
    }
    
    // Add click handler
    layer.on({
      click: () => {
        if (districtName) {
          onDistrictClick(districtName);
          setActiveFeature(feature); // Track which feature was clicked
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
        // Remove focus styling
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
          // Remove focus styles
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

      {/* Add this CSS to fix z-index and focus issues */}
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
      `}</style>
    </div>
  );
};

export default LeafletMap;
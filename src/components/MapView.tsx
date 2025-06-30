import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { MapPin, Users, Calendar, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 14px;
        ">${icon}</span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

interface MapViewProps {
  center?: LatLngExpression;
  zoom?: number;
  showMembers?: boolean;
  showItems?: boolean;
  showEvents?: boolean;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapView: React.FC<MapViewProps> = ({
  center = [40.7128, -74.0060],
  zoom = 13,
  showMembers = true,
  showItems = true,
  showEvents = true,
  interactive = true,
  onLocationSelect
}) => {
  const { currentLoop } = useApp();
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);

  if (!currentLoop) return null;

  const handleMapClick = (e: any) => {
    if (onLocationSelect) {
      const { lat, lng } = e.latlng;
      setSelectedLocation([lat, lng]);
      onLocationSelect(lat, lng);
    }
  };

  const MapClickHandler = () => {
    const map = useMap();
    
    useEffect(() => {
      if (onLocationSelect) {
        map.on('click', handleMapClick);
        return () => {
          map.off('click', handleMapClick);
        };
      }
    }, [map]);

    return null;
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler />

        {/* Loop boundary for neighborhood loops */}
        {currentLoop.type === 'neighborhood' && currentLoop.settings.centerPoint && currentLoop.settings.radius && (
          <Circle
            center={[currentLoop.settings.centerPoint.lat, currentLoop.settings.centerPoint.lng]}
            radius={currentLoop.settings.radius * 1000} // Convert km to meters
            pathOptions={{
              color: '#10B981',
              fillColor: '#10B981',
              fillOpacity: 0.1,
              weight: 2
            }}
          />
        )}

        {/* Member locations */}
        {showMembers && currentLoop.members.map((member) => {
          if (!member.location) return null;
          
          return (
            <Marker
              key={`member-${member.id}`}
              position={[member.location.lat, member.location.lng]}
              icon={createCustomIcon('#3B82F6', member.avatar)}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{member.avatar}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">Reputation: {member.reputation}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{member.location.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Item locations */}
        {showItems && currentLoop.items.map((item) => {
          if (!item.location) return null;
          
          return (
            <Marker
              key={`item-${item.id}`}
              position={[item.location.lat, item.location.lng]}
              icon={createCustomIcon(
                item.status === 'available' ? '#10B981' : 
                item.status === 'borrowed' ? '#F59E0B' : '#EF4444',
                '📦'
              )}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{item.image}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-600 capitalize">{item.status}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.location.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Event locations */}
        {showEvents && currentLoop.events.map((event) => {
          if (!event.coordinates) return null;
          
          return (
            <Marker
              key={`event-${event.id}`}
              position={[event.coordinates.lat, event.coordinates.lng]}
              icon={createCustomIcon('#8B5CF6', '📅')}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.date} at {event.time}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                  <p className="text-xs text-blue-600 mt-1">{event.attendees.length} attending</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Selected location marker */}
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={createCustomIcon('#EF4444', '📍')}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold text-gray-900">Selected Location</p>
                <p className="text-xs text-gray-600">Click to confirm this location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-xl p-3 shadow-lg border border-gray-200">
        <div className="space-y-2">
          {showMembers && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Members</span>
            </div>
          )}
          {showItems && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Available Items</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Borrowed Items</span>
              </div>
            </>
          )}
          {showEvents && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Events</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <MapPin className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
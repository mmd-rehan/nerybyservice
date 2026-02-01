import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type FC } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Button } from '../ui/Button';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom icon for user location
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for services
const serviceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface ServiceLocation {
    id: string;
    title: string;
    category: string;
    location: {
        coordinates: [number, number]; // [lng, lat]
    };
    phone: string;
}

interface ResultsMapProps {
    services: ServiceLocation[];
    userLocation?: { lat: number; lng: number };
}

export const ResultsMap: FC<ResultsMapProps> = ({ services, userLocation }) => {
    // Default center if no user location (e.g. New York)
    const mapCenter = userLocation || { lat: 40.7128, lng: -74.0060 };

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0 relative">
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location */}
                {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {/* Service Pins */}
                {services.map((service) => (
                    <Marker
                        key={service.id}
                        position={{ lat: service.location.coordinates[1], lng: service.location.coordinates[0] }}
                        icon={serviceIcon}
                    >
                        <Popup>
                            <div className="min-w-[150px]">
                                <h3 className="font-bold text-sm">{service.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{service.category}</p>
                                <a href={`tel:${service.phone}`}>
                                    <Button size="sm" className="w-full text-xs py-1 h-auto">Call</Button>
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

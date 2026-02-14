import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type FC } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Button } from '../ui/Button';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Category } from '../../api/categoryApi';

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

// Custom black/yellow marker icon for services
const serviceIcon = L.divIcon({
    className: 'custom-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" style="transform: translate(-50%, -100%);">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#000000"/>
        <circle cx="12" cy="9" r="2.5" fill="#FFC107"/>
    </svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

interface ServiceLocation {
    id: string;
    title: string;
    category: Category;
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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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
                                <p className="text-xs text-gray-500 mb-2">{service.category.name}</p>
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

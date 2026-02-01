import { FC, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface LocationPickerProps {
    value: { lat: number; lng: number };
    onChange: (val: { lat: number; lng: number }) => void;
    radius: number;
    onRadiusChange: (val: number) => void;
}

const DraggableMarker: FC<{
    position: { lat: number; lng: number };
    onChange: (pos: { lat: number; lng: number }) => void
}> = ({ position, onChange }) => {
    const markerRef = useRef<L.Marker>(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng();
                    onChange({ lat, lng });
                }
            },
        }),
        [onChange]
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
};

export const LocationPicker: FC<LocationPickerProps> = ({ value, onChange, radius, onRadiusChange }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="text-sm font-medium text-gray-700">Service Radius: {radius / 1000} km</label>
                <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={radius}
                    onChange={(e) => onRadiusChange(Number(e.target.value))}
                    className="w-1/2"
                />
            </div>

            <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md border border-gray-300 z-0 relative">
                <MapContainer center={value} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker position={value} onChange={onChange} />
                    <Circle center={value} radius={radius} pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }} />
                </MapContainer>
            </div>
            <p className="text-sm text-gray-500 text-center">Drag the marker to pinpoint your location.</p>
        </div>
    );
};

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type FC, useMemo, useRef, useEffect } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

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

// Custom black/yellow marker icon
const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" style="transform: translate(-50%, -100%);">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#000000"/>
        <circle cx="12" cy="9" r="2.5" fill="#FFC107"/>
    </svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

interface LocationPickerProps {
    value: { lat: number; lng: number };
    onChange: (val: { lat: number; lng: number }) => void;
    radius: number;
    onRadiusChange: (val: number) => void;
}

const MapUpdater: FC<{ center: { lat: number; lng: number } }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

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
            icon={customIcon}
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
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapUpdater center={value} />
                    <DraggableMarker position={value} onChange={onChange} />
                    <Circle center={value} radius={radius} pathOptions={{ fillColor: 'black', fillOpacity: 0.1, color: 'black', weight: 1 }} />
                </MapContainer>
            </div>
            <p className="text-sm text-gray-500 text-center">Drag the marker to pinpoint your location.</p>
        </div>
    );
};

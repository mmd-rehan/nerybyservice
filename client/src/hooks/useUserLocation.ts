import { useState, useEffect } from 'react';

interface Location {
    lat: number;
    lng: number;
}

interface UseUserLocationResult {
    location: Location | null;
    loading: boolean;
    error: string | null;
}

export const useUserLocation = (): UseUserLocationResult => {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocation = async () => {
            setLoading(true);
            setError(null);

            // 1. Try Browser Geolocation
            if ("geolocation" in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            timeout: 5000,
                            maximumAge: 0
                        });
                    });

                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLoading(false);
                    return;
                } catch (err) {
                    console.warn("Geolocation failed or denied, falling back to IP location.", err);
                }
            }

            // 2. Fallback to IP-based location via Backend
            try {
                // Assuming Vite proxy is set up or backend is on the same domain/port for production
                // If strictly local dev without proxy, might need full URL, but refined approach is relative.
                const response = await fetch('http://localhost:3030/api/location');
                if (!response.ok) {
                    throw new Error('Failed to fetch IP location');
                }
                const data = await response.json();

                if (data.latitude && data.longitude) {
                    setLocation({
                        lat: data.latitude,
                        lng: data.longitude
                    });
                } else {
                    throw new Error('Invalid IP location data');
                }
            } catch (err: any) {
                console.error("IP location fallback failed:", err);
                setError(err.message || 'Could not determine location');
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    return { location, loading, error };
};

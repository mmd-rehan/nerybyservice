import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios'; // Import centralized axios instance

interface Location {
    lat: number;
    lng: number;
}

interface UseUserLocationResult {
    location: Location | null;
    loading: boolean;
    error: string | null;
    permissionDenied: boolean;
    retry: () => void;
}

export const useUserLocation = (): UseUserLocationResult => {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => {
        setLocation(null);
        setError(null);
        setPermissionDenied(false);
        setLoading(true);
        setAttempt((prev) => prev + 1);
    }, []);

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
                    setPermissionDenied(false);
                    setLoading(false);
                    return;
                } catch (err: any) {
                    const isDenied = err?.code === 1; // GeolocationPositionError.PERMISSION_DENIED
                    setPermissionDenied(isDenied);
                    console.warn("Geolocation failed or denied, falling back to IP location.", err);
                }
            }

            // 2. Fallback to IP-based location via Backend
            try {
                const response = await api.get('/location'); // Use centralized axios instance
                const data = response.data;

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
    }, [attempt]);

    return { location, loading, error, permissionDenied, retry };
};

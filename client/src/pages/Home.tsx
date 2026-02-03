import { useState, useEffect, useCallback } from 'react';
import { useUserLocation } from '../hooks/useUserLocation';
import { SearchHero } from '../components/Search/SearchHero';
import { ResultsList } from '../components/Search/ResultsList';
import { ResultsMap } from '../components/Search/ResultsMap';
import { Button } from '../components/ui/Button';
import { searchServices, type Service } from '../api/serviceApi';
import { Map, List, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [results, setResults] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { location: autoLocation } = useUserLocation();
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
    const [locationName, setLocationName] = useState('');

    // Update userLocation when autoLocation is available and search
    useEffect(() => {
        if (autoLocation) {
            setUserLocation(autoLocation);
            setLocationName('Nearby'); // Set a default name or handle reverse geocoding
            performSearch('', autoLocation.lat, autoLocation.lng);
        } else {
            // Initial search if no location yet (or waiting for it)
            // performSearch(''); // Optional: might want to wait slightly or just search global first
            if (!userLocation) performSearch('');
        }
    }, [autoLocation]);

    const performSearch = async (query: string, lat?: number, lng?: number) => {
        setIsLoading(true);
        try {
            // Prefer passed location, fallback to user location, fallback to undefined (global search)
            const searchLat = lat ?? userLocation?.lat;
            const searchLng = lng ?? userLocation?.lng;

            const data = await searchServices({
                query: query || undefined, // Send undefined if empty string to match "All"
                lat: searchLat,
                lng: searchLng,
                radius: 50000 // 50km default
            });
            setResults(data.data || []);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationRequest = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setLocationName('Current Location'); // In a real app, reverse geocode here
                performSearch('', latitude, longitude); // Refresh results with new location
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Could not access location. Please enable permissions.');
            }
        );
    }, []);

    const handleSearch = (query: string, _locationText?: string) => {
        // Implement logic to handle "locationText" (e.g., geocoding API)
        // For now, we assume userLocation is used if set
        performSearch(query);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <SearchHero
                onSearch={handleSearch}
                onLocationRequest={handleLocationRequest}
                currentLocationName={locationName}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isLoading ? 'Searching...' : `${results.length} providers`}
                    </h2>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'list'
                                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'map'
                                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <Map className="w-4 h-4" />
                                Map
                            </button>
                        </div>

                        {/* Add Service Button */}
                        <Link to="/add-service">
                            <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-none border-0 h-10 px-6 font-semibold">
                                <Plus className="w-4 h-4 mr-2" />
                                List Service
                            </Button>
                        </Link>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <ResultsList results={results} />
                ) : (
                    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                        <ResultsMap
                            services={results.map((r) => ({
                                id: r._id,
                                title: r.serviceTitle,
                                category: r.category,
                                location: r.location,
                                phone: r.phoneNumber || r.contactDetails?.phone
                            }))}
                            userLocation={userLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

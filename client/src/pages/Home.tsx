import { useState, useEffect } from 'react';
import { useUserLocation } from '../hooks/useUserLocation';
import { SearchHero } from '../components/Search/SearchHero';
import { ResultsList } from '../components/Search/ResultsList';
import { ResultsMap } from '../components/Search/ResultsMap';
import { ShimmerCard } from '../components/Search/ShimmerCard';
import { Button } from '../components/ui/Button';
import { searchServices, type Service } from '../api/serviceApi';
import { Map, List, Plus, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [results, setResults] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams, setSearchParams] = useState<{ query: string; lat?: number; lng?: number; radius?: number }>({ query: '' });

    const { location: autoLocation, permissionDenied, retry: retryLocation } = useUserLocation();
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);

    // Update userLocation when autoLocation is available and search
    useEffect(() => {
        if (autoLocation) {
            setUserLocation(autoLocation);
            // Initial search with new location
            handleSearch('', autoLocation.lat, autoLocation.lng);
        } else {
            // Initial search if no location yet (or waiting for it)
            // if (!userLocation) performSearch('');
        }
    }, [autoLocation]);


    const executeSearch = async (query: string, lat?: number, lng?: number, radius?: number, pageNum: number = 1) => {
        try {
            const data = await searchServices({
                query: query || undefined,
                lat: lat,
                lng: lng,
                radius: radius || 50000, // 50km default
                page: pageNum,
                limit: 20
            });
            return data;
        } catch (error) {
            console.error('Search failed:', error);
            return null;
        }
    }

    // Called when user types in search bar or location changes (initial fetch)
    const handleSearch = async (query: string, lat?: number, lng?: number) => {
        const searchLat = lat ?? userLocation?.lat;
        const searchLng = lng ?? userLocation?.lng;

        setSearchParams({ query, lat: searchLat, lng: searchLng, radius: 50000 });
        setPage(1);
        setHasMore(true);
        setIsLoading(true);

        const data = await executeSearch(query, searchLat, searchLng, 50000, 1);

        if (data) {
            setResults(data.data || []);
            setHasMore(data.pagination?.hasMore ?? false);
        } else {
            setResults([]);
            setHasMore(false);
        }
        setIsLoading(false);
    };

    const handleMapChange = async (center: { lat: number, lng: number }, radius: number) => {
        // Debounce could be added here if needed, but moveend is usually enough
        const newRadius = Math.round(radius); // Convert to meters integer
        setSearchParams(prev => ({ ...prev, lat: center.lat, lng: center.lng, radius: newRadius }));
        setPage(1);
        setHasMore(true);
        setIsLoading(true);

        const data = await executeSearch(searchParams.query, center.lat, center.lng, newRadius, 1);

        if (data) {
            setResults(data.data || []);
            setHasMore(data.pagination?.hasMore ?? false);
        } else {
            setResults([]);
            setHasMore(false);
        }
        setIsLoading(false);
    };

    const loadMore = async () => {
        if (isLoading || isFetchingMore || !hasMore) return;

        setIsFetchingMore(true);
        const nextPage = page + 1;

        const data = await executeSearch(searchParams.query, searchParams.lat, searchParams.lng, searchParams.radius, nextPage);

        if (data) {
            setResults(prev => {
                const newServices = data.data || [];
                const existingIds = new Set(prev.map(p => p._id));
                const uniqueNewServices = newServices.filter(s => !existingIds.has(s._id));
                return [...prev, ...uniqueNewServices];
            });
            setHasMore(data.pagination?.hasMore ?? false);
            setPage(nextPage);
        }
        setIsFetchingMore(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <SearchHero
                onSearch={handleSearch}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Location Permission Banner */}
                {permissionDenied && !autoLocation && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-start animate-fadeInUp">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-amber-900">Location access blocked</p>
                                <p className="text-xs text-amber-700">Enable location to discover services near you. You may need to allow it in your browser settings first.</p>
                            </div>
                        </div>
                        <button
                            onClick={retryLocation}
                            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Enable Location
                        </button>
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-start animate-fadeInUp anim-delay-3">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isLoading ? 'Searching...' : `${results.length} providers near you`}
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
                    isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <ShimmerCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <ResultsList
                            results={results}
                            onLoadMore={loadMore}
                            hasMore={hasMore}
                            loading={isFetchingMore}
                        />
                    )
                ) : (
                    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 animate-start animate-fadeIn relative">
                        {isLoading && (
                            <div className="absolute inset-0 z-[1000] bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                            </div>
                        )}
                        <ResultsMap
                            services={results.map((r) => ({
                                id: r._id,
                                title: r.serviceTitle,
                                category: r.category,
                                location: r.location,
                                phone: r.phoneNumber || r.contactDetails?.phone
                            }))}
                            userLocation={userLocation}
                            onMapChange={handleMapChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { useUserLocation } from '../hooks/useUserLocation';
import { SearchHero } from '../components/Search/SearchHero';
import { ResultsList } from '../components/Search/ResultsList';
import { ResultsMap } from '../components/Search/ResultsMap';
import { ShimmerCard } from '../components/Search/ShimmerCard';
import { Button } from '../components/ui/Button';
import { searchServices, aiSearchServices, type Service } from '../api/serviceApi';
import { Map, List, Plus, MapPin, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [results, setResults] = useState<Service[]>([]);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams, setSearchParams] = useState<{ query: string; lat?: number; lng?: number; radius?: number }>({ query: '' });
    const [interpretedQuery, setInterpretedQuery] = useState<any>(null);

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

        setInterpretedQuery(null);
        setSearchParams({ query, lat: searchLat, lng: searchLng, radius: 50000 });
        setPage(1);
        setHasMore(true);
        setIsLoading(true);

        const data = await executeSearch(query, searchLat, searchLng, 50000, 1);

        if (data) {
            setResults(data.data || []);
            setTotalResults(data.pagination?.total || data.data?.length || 0);
            setHasMore(data.pagination?.hasMore ?? false);
        } else {
            setResults([]);
            setTotalResults(0);
            setHasMore(false);
        }
        setIsLoading(false);
    };

    const handleAiSearchSubmit = async (query: string, audioBlob?: Blob | null, imageFile?: File | null, videoFile?: File | null) => {
        const searchLat = userLocation?.lat;
        const searchLng = userLocation?.lng;

        if (!searchLat || !searchLng) {
            alert("Please enable location access to use AI search.");
            return;
        }

        setInterpretedQuery(null);
        setSearchParams({ query, lat: searchLat, lng: searchLng, radius: 5000 });
        setPage(1);
        setHasMore(false);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('query', query);
            formData.append('userLocation', JSON.stringify({ lat: searchLat, lng: searchLng }));
            if (audioBlob) {
                formData.append('audio', audioBlob, 'voice.webm');
            }
            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (videoFile) {
                formData.append('video', videoFile);
            }

            const data = await aiSearchServices(formData);
            if (data && data.success) {
                setResults(data.results || []);
                setTotalResults(data.results?.length || 0);
                setInterpretedQuery(data.interpretedQuery);
            } else {
                setResults([]);
                setTotalResults(0);
            }
        } catch (error) {
            console.error("AI Search failed:", error);
            setResults([]);
            setTotalResults(0);
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
            setTotalResults(data.pagination?.total || data.data?.length || 0);
            setHasMore(data.pagination?.hasMore ?? false);
        } else {
            setResults([]);
            setTotalResults(0);
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
            setTotalResults(data.pagination?.total ?? totalResults);
            setHasMore(data.pagination?.hasMore ?? false);
            setPage(nextPage);
        }
        setIsFetchingMore(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <SearchHero
                onSearch={handleSearch}
                onAiSearch={handleAiSearchSubmit}
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
                    <div className="flex flex-col gap-2">
                        {interpretedQuery && (
                            <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                                <p className="font-semibold text-sm">
                                    <Sparkles className="w-4 h-4 inline-block mr-1 text-amber-500" />
                                    AI Understood: <span className="font-normal text-amber-800">
                                        {interpretedQuery.originalExtractedText ? `"${interpretedQuery.originalExtractedText}" -> Finding ` : 'Looking for '}
                                        <strong className="font-semibold">{interpretedQuery.service || 'services'}</strong> 
                                        {interpretedQuery.category ? ` in ${interpretedQuery.category}` : ''} 
                                        {interpretedQuery.keywords && interpretedQuery.keywords.length > 0 ? ` related to "${interpretedQuery.keywords.join(', ')}"` : ''}
                                    </span>
                                </p>
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-gray-900">
                            {isLoading ? 'Searching...' : `${totalResults} providers near you`}
                        </h2>
                    </div>

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
                    <div className="h-[70vh] overflow-y-auto pr-2 pb-4 style-scrollbar">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
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
                        )}
                    </div>
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

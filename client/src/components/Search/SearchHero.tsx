import { MapPin, Search } from 'lucide-react';
import { type FC, useState, useEffect } from 'react';

interface SearchHeroProps {
    onSearch: (query: string, location?: string) => void;
    onLocationRequest: () => void;
    currentLocationName?: string;
}

const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'Plumber', label: 'Plumbing', icon: '🔧' },
    { id: 'Electrician', label: 'Electrical', icon: '⚡' },
    { id: 'Cleaner', label: 'Cleaning', icon: '✨' },
    { id: 'Carpenter', label: 'Carpentry', icon: '🪚' },
    { id: 'Painter', label: 'Painting', icon: '🎨' },
    { id: 'Mechanic', label: 'Mechanic', icon: '🚗' },
];

export const SearchHero: FC<SearchHeroProps> = ({ onSearch, onLocationRequest, currentLocationName }) => {
    const [searchText, setSearchText] = useState('');
    const [locationText, setLocationText] = useState(currentLocationName || '');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Update local state if prop changes (e.g. geolocation found)
    useEffect(() => {
        if (currentLocationName) setLocationText(currentLocationName);
    }, [currentLocationName]);

    const handleSearchSubmit = () => {
        onSearch(searchText === 'all' ? '' : searchText, locationText);
    };

    const handleCategoryClick = (catId: string) => {
        setSelectedCategory(catId);
        onSearch(catId === 'all' ? '' : catId, locationText);
    };

    return (
        <div className="bg-white pb-8 pt-12 px-4 border-b border-gray-100">
            <div className="max-w-5xl mx-auto text-center space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Find Local Services
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Connect with trusted professionals near you
                    </p>
                </div>

                {/* Search Inputs Container */}
                <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto p-2">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow shadow-sm"
                            placeholder="What do you need help with?"
                        />
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={locationText}
                            onChange={(e) => setLocationText(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow shadow-sm"
                            placeholder="City or Zip"
                        />
                        <button
                            onClick={onLocationRequest}
                            className="absolute inset-y-0 right-2 px-3 text-xs font-medium text-gray-500 hover:text-black"
                        >
                            Detect
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`
                                flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all border
                                ${selectedCategory === cat.id
                                    ? 'bg-black text-white border-black shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

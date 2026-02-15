import { Briefcase, Bug, Car, Cog, Grid, Hammer, Home, Key, MoreHorizontal, Paintbrush, Ruler, Search, Sparkles, Trees, Truck, Wind, Wrench, Zap } from 'lucide-react';

import { useEffect, useState, type FC } from 'react';
import { fetchCategories } from '../../api/categoryApi';

interface SearchHeroProps {
    onSearch: (query: string, location?: string) => void;
    currentLocationName?: string;
}

interface DisplayCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const DEFAULT_CATEGORY: DisplayCategory = { id: 'all', label: 'All', icon: <Grid className="w-4 h-4" /> };

const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('plumb')) return <Wrench className="w-4 h-4" />;
    if (lower.includes('electr')) return <Zap className="w-4 h-4" />;
    if (lower.includes('clean')) return <Sparkles className="w-4 h-4" />;
    if (lower.includes('landscap')) return <Trees className="w-4 h-4" />;
    if (lower.includes('handy')) return <Hammer className="w-4 h-4" />;
    if (lower.includes('mov')) return <Truck className="w-4 h-4" />;
    if (lower.includes('paint')) return <Paintbrush className="w-4 h-4" />;
    if (lower.includes('hvac')) return <Wind className="w-4 h-4" />;
    if (lower.includes('roof')) return <Home className="w-4 h-4" />;
    if (lower.includes('pest')) return <Bug className="w-4 h-4" />;
    if (lower.includes('applianc')) return <Cog className="w-4 h-4" />;
    if (lower.includes('lock')) return <Key className="w-4 h-4" />;
    if (lower.includes('carpent')) return <Ruler className="w-4 h-4" />;
    if (lower.includes('other')) return <MoreHorizontal className="w-4 h-4" />;
    if (lower.includes('mechanic')) return <Car className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
};

export const SearchHero: FC<SearchHeroProps> = ({ onSearch, currentLocationName }) => {
    const [searchText, setSearchText] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState<DisplayCategory[]>([DEFAULT_CATEGORY]);



    // Fetch categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                const formatted: DisplayCategory[] = data.map(cat => ({
                    id: cat._id, // Use _id as the search key
                    label: cat.name,
                    icon: getCategoryIcon(cat.name)
                }));
                setCategories([DEFAULT_CATEGORY, ...formatted]);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        loadCategories();
    }, []);

    const handleSearchSubmit = () => {
        onSearch(searchText === 'all' ? '' : searchText, currentLocationName);
    };

    const handleCategoryClick = (catId: string, label: string) => {
        setSelectedCategory(catId);
        // If "All" is selected, clear search. Otherwise use the ID or Name.
        // The backend search might expect a name or ID. 
        // Based on previous tasks, the search on backend checks `category.name` or `serviceTitle`.
        // So we should probably pass the category name (label) as the query if it's not 'all'.
        onSearch(catId === 'all' ? '' : label, currentLocationName);
    };

    return (
        <div className="bg-white pb-8 pt-12 px-4 border-b border-gray-100">
            <div className="max-w-5xl mx-auto text-center space-y-8">
                <div className="animate-start animate-fadeInUp">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Find Local Services
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Connect with trusted professionals near you
                    </p>
                </div>

                {/* Search Inputs Container */}
                <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto p-2 animate-start animate-fadeInUp anim-delay-2">
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


                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 animate-start animate-fadeIn anim-delay-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id, cat.label)}
                            className={`
                                flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all border
                                ${selectedCategory === cat.id
                                    ? 'bg-black text-white border-black shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            <span className="mr-2 flex items-center">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

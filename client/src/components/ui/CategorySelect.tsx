import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { fetchCategories, createCategory, type Category } from '../../api/categoryApi';
import { Button } from '../ui/Button';

interface CategorySelectProps {
    value: string; // This should be the category ID or Name depending on usages. For now, we will use ID if available, or Name.
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    className?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, label, error, className }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!search.trim()) return;
        setIsCreating(true);
        try {
            const newCategory = await createCategory(search.trim());
            setCategories([...categories, newCategory]);
            onChange(newCategory._id);
            setIsOpen(false);
            setSearch('');
        } catch (err) {
            console.error('Failed to create category', err);
            alert('Failed to create category');
        } finally {
            setIsCreating(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCategory = categories.find(c => c._id === value || c.name === value);

    return (
        <div className={`space-y-1 ${className}`} ref={wrapperRef}>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                    <span className={`block truncate ${!selectedCategory ? 'text-gray-400' : 'text-gray-900'}`}>
                        {selectedCategory ? selectedCategory.name : 'Select a category'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg animate-fade-in-up">
                        <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto p-1">
                            {isLoading ? (
                                <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <button
                                        key={category._id}
                                        type="button"
                                        onClick={() => {
                                            onChange(category._id);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                                    >
                                        <span className="font-medium text-gray-700 group-hover:text-black">
                                            {category.name}
                                        </span>
                                        {(value === category._id || value === category.name) && (
                                            <Check className="w-4 h-4 text-black" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center">
                                    <p className="text-sm text-gray-500 mb-3">
                                        No data found. Do you want to add new item - "{search}"?
                                    </p>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleCreateCategory}
                                        disabled={isCreating || !search.trim()}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 w-full justify-center"
                                    >
                                        {isCreating ? 'Adding...' : 'Add new item'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

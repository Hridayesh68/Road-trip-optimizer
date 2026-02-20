import React, { useState } from 'react';
import axios from 'axios';
import { IoSearchOutline, IoLocationOutline } from 'react-icons/io5';

const CitySelector = ({ onAddCity, selectedCities, onOptimize, onReset, isOptimized }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&featuretype=city&limit=5`,
                { headers: { 'Accept-Language': 'en' } }
            );

            // Map results to our expected format
            const results = response.data.map(item => ({
                name: item.display_name.split(',')[0], // Extract main city name
                fullName: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
            })).filter((city, index, self) =>
                // Basic deduplication by name
                index === self.findIndex((t) => t.name === city.name)
            );

            setSearchResults(results);
        } catch (error) {
            console.error("Failed to search cities:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleAdd = (city) => {
        if (!selectedCities.find(c => c.name === city.name)) {
            onAddCity({
                name: city.name,
                lat: city.lat,
                lng: city.lng
            });
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Plan Your Trip</h2>

            <div className="mb-6 relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search for a City</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IoSearchOutline className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. Mumbai, New York..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            disabled={isOptimized}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={!searchQuery.trim() || isOptimized || isSearching}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                    >
                        {isSearching ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Search'}
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((city, index) => (
                            <button
                                key={index}
                                onClick={() => handleAdd(city)}
                                disabled={selectedCities.some(c => c.name === city.name)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-0 flex items-start gap-3 transition-colors disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoLocationOutline className="text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="font-medium text-gray-800">{city.name}</div>
                                    <div className="text-xs text-gray-500 truncate mt-0.5">{city.fullName}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Selected Cities</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{selectedCities.length}</span>
                </div>

                {selectedCities.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">No cities added yet. Search and add destinations above.</p>
                    </div>
                ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {selectedCities.map((city, index) => (
                            <li key={index} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex-shrink-0">
                                    {index + 1}
                                </div>
                                <span className="font-medium text-gray-700 truncate">{city.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onOptimize}
                    disabled={selectedCities.length < 2 || isOptimized}
                    className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-lg hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isOptimized ? 'Route Optimized ✓' : 'Optimize Route'}
                </button>
                <button
                    onClick={onReset}
                    className="flex-shrink-0 bg-gray-100 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default CitySelector;

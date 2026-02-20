import { useState, useContext } from 'react';
import { TripContext } from '../context/TripContext';
import { Navigate } from 'react-router-dom';
import AttractionList from '../components/Tourist/AttractionList';
import AttractionFilter from '../components/Tourist/AttractionFilter';

const Attractions = () => {
    const { optimizedRoute } = useContext(TripContext);
    const [selectedCityIndex, setSelectedCityIndex] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [minRatingFilter, setMinRatingFilter] = useState('');

    if (!optimizedRoute || optimizedRoute.length === 0) {
        return <Navigate to="/plan-trip" replace />;
    }

    const currentCity = optimizedRoute[selectedCityIndex];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explore Attractions</h1>
                <p className="text-gray-500 mt-2">Discover museums, parks, and landmarks across your road trip.</p>
            </div>

            {/* City Tabs */}
            <div className="flex overflow-x-auto space-x-2 pb-4 mb-6 custom-scrollbar">
                {optimizedRoute.map((city, index) => (
                    <button
                        key={city.name}
                        onClick={() => {
                            setSelectedCityIndex(index);
                            setCategoryFilter(''); // reset filters on city change
                        }}
                        className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${selectedCityIndex === index
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <span className="text-xs opacity-75 mr-2">Stop {index + 1}</span>
                        {city.name}
                    </button>
                ))}
            </div>

            <AttractionFilter
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                minRatingFilter={minRatingFilter}
                setMinRatingFilter={setMinRatingFilter}
            />

            <AttractionList
                city={currentCity}
                categoryFilter={categoryFilter}
                minRatingFilter={minRatingFilter}
            />
        </div>
    );
};

export default Attractions;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TripMap from '../components/Map/TripMap';
import CitySelector from '../components/Trip/CitySelector';
import tripService from '../services/tripService';
import { TripContext } from '../context/TripContext';

const PlanTrip = () => {
    const navigate = useNavigate();
    const {
        selectedCities,
        addCity,
        clearTrip,
        setOptimizedRoute,
        setTotalDistance
    } = useContext(TripContext);

    const [loading, setLoading] = useState(false);

    const handleOptimize = async () => {
        setLoading(true);
        try {
            const data = await tripService.optimizeTrip(selectedCities);
            setOptimizedRoute(data.optimizedRoute);
            setTotalDistance(data.totalDistance);
            navigate('/trip-result'); // Route to the new results page
        } catch (error) {
            console.error("Optimization failed:", error);
            alert("Optimization failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[85vh] bg-gray-50 max-w-7xl mx-auto mt-4 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            {/* Sidebar for controls */}
            <div className="w-full lg:w-1/3 p-6 bg-white overflow-y-auto border-r border-gray-100 relative z-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold border-b pb-2 text-gray-800">Route Builder</h1>
                    <p className="text-sm text-gray-500 mt-2">Add cities to your trip. Our algorithms will find the most efficient path between them.</p>
                </div>

                <CitySelector
                    onAddCity={addCity}
                    selectedCities={selectedCities}
                    onOptimize={handleOptimize}
                    onReset={clearTrip}
                    isOptimized={false}
                />
            </div>

            {/* Map Area */}
            <div className="w-full lg:w-2/3 relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                        <div className="text-blue-800 font-bold text-xl drop-shadow-sm">Running TSP Optimization...</div>
                        <div className="text-gray-600 font-medium mt-2">Calculating permutations across {selectedCities.length} locations</div>
                    </div>
                )}
                <div className="h-full w-full shadow-inner">
                    <TripMap cities={selectedCities} isOptimized={false} />
                </div>
            </div>
        </div>
    );
};

export default PlanTrip;

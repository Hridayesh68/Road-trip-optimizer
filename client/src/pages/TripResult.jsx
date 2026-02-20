import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripContext } from '../context/TripContext';
import { AuthContext } from '../context/AuthContext';
import TripMap from '../components/Map/TripMap';
import RouteResult from '../components/Trip/RouteResult';
import TripSummary from '../components/Trip/TripSummary';
import axios from 'axios';
import { IoSaveOutline, IoBedOutline, IoCameraOutline } from 'react-icons/io5';

const TripResult = () => {
    const { optimizedRoute, totalDistance, selectedCities } = useContext(TripContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSaveTrip = async () => {
        if (!user) {
            alert('Please login to save trips!');
            navigate('/login');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/trips', {
                cities: selectedCities,
                optimizedRoute,
                totalDistance,
                name: `Trip to ${optimizedRoute[0]?.name} & Beyond`
            }, config);

            alert('Trip Saved Successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to save trip');
        }
    };

    if (!optimizedRoute || optimizedRoute.length === 0) {
        return (
            <div className="text-center p-20">
                <h2 className="text-2xl font-bold text-gray-700">No route planned yet.</h2>
                <button onClick={() => navigate('/plan-trip')} className="mt-4 text-blue-600 underline">Go Planner</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Optimized Trip</h1>
                    <p className="text-gray-600">We've calculated the shortest possible route to visit all your selected stops.</p>
                </div>

                <TripSummary />
                <RouteResult />

                <div className="flex flex-col space-y-3 pt-4 border-t">
                    <button
                        onClick={() => navigate('/book-hotels')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md"
                    >
                        <IoBedOutline className="mr-2 text-xl" /> Find Hotels for Route
                    </button>
                    <button
                        onClick={() => navigate('/attractions')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md"
                    >
                        <IoCameraOutline className="mr-2 text-xl" /> Explore Attractions
                    </button>
                    <button
                        onClick={handleSaveTrip}
                        className="w-full bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
                    >
                        <IoSaveOutline className="mr-2 text-xl text-gray-500" /> Save Trip to Dashboard
                    </button>
                </div>
            </div>

            <div className="w-full lg:w-2/3 min-h-[500px] h-[75vh] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <TripMap cities={optimizedRoute} isOptimized={true} />
            </div>
        </div>
    );
};

export default TripResult;

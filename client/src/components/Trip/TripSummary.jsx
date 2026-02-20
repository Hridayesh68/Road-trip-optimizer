import { useContext } from 'react';
import { TripContext } from '../../context/TripContext';
import { formatDistance, formatDuration } from '../../utils/distanceFormatter';
import { IoTimerOutline, IoMapOutline, IoCarOutline } from 'react-icons/io5';

const TripSummary = () => {
    const { totalDistance, optimizedRoute } = useContext(TripContext);

    if (!optimizedRoute || optimizedRoute.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg mt-4 w-full">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <IoMapOutline className="mr-2 text-2xl" /> Trip Summary
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-lg flex items-center">
                    <IoCarOutline className="text-2xl mr-3 text-blue-200" />
                    <div>
                        <p className="text-blue-100 text-xs uppercase font-semibold tracking-wider">Total Distance</p>
                        <p className="text-xl font-bold">{formatDistance(totalDistance)}</p>
                    </div>
                </div>

                <div className="bg-white/10 p-3 rounded-lg flex items-center">
                    <IoTimerOutline className="text-2xl mr-3 text-blue-200" />
                    <div>
                        <p className="text-blue-100 text-xs uppercase font-semibold tracking-wider">Est. Driving Time</p>
                        <p className="text-xl font-bold">{formatDuration(totalDistance)}</p>
                    </div>
                </div>

                <div className="col-span-2 bg-white/10 p-3 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-xs uppercase font-semibold tracking-wider">Total Stops</p>
                        <p className="text-xl font-bold">{optimizedRoute.length} Cities</p>
                    </div>
                    <div className="text-right">
                        <p className="text-blue-100 text-xs uppercase font-semibold tracking-wider">Route Type</p>
                        <p className="text-sm font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded inline-block mt-1">
                            TSP Optimized
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripSummary;

import { useContext } from 'react';
import { TripContext } from '../../context/TripContext';
import { IoLocationOutline, IoArrowForward } from 'react-icons/io5';

const RouteResult = () => {
    const { optimizedRoute } = useContext(TripContext);

    if (!optimizedRoute || optimizedRoute.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100 mt-4">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Optimized Visit Order</h3>
            <div className="relative">
                {/* Vertical line connecting nodes */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-blue-100 border-dashed border-l-2 border-blue-300"></div>

                <div className="flex flex-col space-y-4">
                    {optimizedRoute.map((city, index) => (
                        <div key={city.name} className="flex items-center group">
                            <div className="relative z-10 w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm transition-transform group-hover:scale-110">
                                {index + 1}
                            </div>
                            <div className="ml-4 flex-1">
                                <h4 className="font-semibold text-gray-800">{city.name}</h4>
                                {index < optimizedRoute.length - 1 && (
                                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                                        Travel to next stop <IoArrowForward className="mx-1" />
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RouteResult;

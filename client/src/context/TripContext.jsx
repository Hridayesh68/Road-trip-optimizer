import { createContext, useState } from 'react';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
    const [selectedCities, setSelectedCities] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState(null);
    const [totalDistance, setTotalDistance] = useState(0);

    const addCity = (city) => {
        if (!selectedCities.find(c => c.name === city.name)) {
            setSelectedCities([...selectedCities, city]);
        }
    };

    const removeCity = (cityName) => {
        setSelectedCities(selectedCities.filter(c => c.name !== cityName));
    };

    const clearTrip = () => {
        setSelectedCities([]);
        setOptimizedRoute(null);
        setTotalDistance(0);
    };

    return (
        <TripContext.Provider value={{
            selectedCities,
            setSelectedCities,
            addCity,
            removeCity,
            optimizedRoute,
            setOptimizedRoute,
            totalDistance,
            setTotalDistance,
            clearTrip
        }}>
            {children}
        </TripContext.Provider>
    );
};

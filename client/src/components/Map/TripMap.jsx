import React, { useContext, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RoutePolyline from './RoutePolyline';
import CityMarker from './CityMarker';
import { TripContext } from '../../context/TripContext';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to adjust bounds of the map dynamically
function FitBounds({ cities }) {
    const map = useMap();

    useEffect(() => {
        if (!cities || cities.length === 0) return;

        // Extract valid coordinates
        const coords = cities
            .filter(c => c && c.lat && c.lng && !isNaN(c.lat) && !isNaN(c.lng))
            .map(c => [c.lat, c.lng]);

        if (coords.length > 0) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [cities, map]);

    return null;
}

const TripMap = ({ cities = [], isOptimized = false }) => {
    // Default center (India)
    const center = [20.5937, 78.9629];
    const zoom = 5;
    const { visualizedRoute } = useContext(TripContext);

    // Safety check - ensure we have an array to work with
    const safeCities = Array.isArray(cities) ? cities : [];

    // Determine which route we are actually trying to show
    // Usually visualizedRoute takes precedence on the planning page if active
    const routeToShow = visualizedRoute || safeCities;

    // When visualizing an experimental route, it might only contain a subset 
    // or different order of the cities currently placed on the map.
    const isShowingVisualization = !!visualizedRoute;

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Always render all selected cities */}
            {safeCities.map((city, index) => (
                <CityMarker
                    key={`${city.name}-${index}`}
                    city={city}
                    orderIndex={isOptimized ? index : undefined}
                    isVisualized={isShowingVisualization}
                    visualIndex={routeToShow.findIndex(v => v.name === city.name)}
                />
            ))}

            {/* Either TSP routes or Visualizer Paths */}
            {(isOptimized || isShowingVisualization) && routeToShow.length > 1 && (
                <RoutePolyline
                    optimizedRoute={routeToShow}
                    color={isShowingVisualization ? '#8b5cf6' : '#2563eb'}
                    weight={isShowingVisualization ? 6 : 4}
                    dashArray={isShowingVisualization ? '' : '10, 10'}
                />
            )}

            {/* Dynamic Bounds Zooming */}
            <FitBounds cities={routeToShow.length > 0 ? routeToShow : safeCities} />
        </MapContainer>
    );
};

export default TripMap;

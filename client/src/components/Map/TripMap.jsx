import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RoutePolyline from './RoutePolyline';
import CityMarker from './CityMarker';

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

function ChangeView({ center }) {
    const map = useMap();
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
        map.setView(center, map.getZoom());
    }
    return null;
}

const TripMap = ({ cities = [], isOptimized = false }) => {
    // Default center (India)
    const center = [20.5937, 78.9629];
    const zoom = 5;

    // Safety check - ensure we have an array to work with
    const safeCities = Array.isArray(cities) ? cities : [];

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {safeCities.map((city, index) => (
                <CityMarker
                    key={`${city.name}-${index}`}
                    city={city}
                    orderIndex={isOptimized ? index : undefined}
                />
            ))}

            {isOptimized && safeCities.length > 1 && (
                <RoutePolyline optimizedRoute={safeCities} />
            )}

            {safeCities.length > 0 && safeCities[0] && safeCities[0].lat && safeCities[0].lng && (
                <ChangeView center={[safeCities[0].lat, safeCities[0].lng]} />
            )}
        </MapContainer>
    );
};

export default TripMap;

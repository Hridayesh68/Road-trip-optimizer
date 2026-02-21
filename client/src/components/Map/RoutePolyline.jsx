import { Polyline } from 'react-leaflet';

const RoutePolyline = ({ optimizedRoute, color = "#2563eb", weight = 4, dashArray = "10, 10" }) => {
    if (!optimizedRoute || optimizedRoute.length < 2) return null;

    const positions = optimizedRoute.map(city => [city.lat, city.lng]);

    return (
        <Polyline
            positions={positions}
            color={color}
            weight={weight}
            opacity={0.8}
            dashArray={dashArray}
        />
    );
};

export default RoutePolyline;

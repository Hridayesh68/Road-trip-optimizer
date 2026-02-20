import { Polyline } from 'react-leaflet';

const RoutePolyline = ({ optimizedRoute }) => {
    if (!optimizedRoute || optimizedRoute.length < 2) return null;

    const positions = optimizedRoute.map(city => [city.lat, city.lng]);

    return (
        <Polyline
            positions={positions}
            color="#2563eb"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
        />
    );
};

export default RoutePolyline;

const axios = require('axios');

const ORS_BASE_URL = 'https://api.openrouteservice.org';

/**
 * Helper to get coordinates for a place name using ORS Geocoding API
 * @param {string} placeName 
 * @returns {Promise<Array>} [longitude, latitude]
 */
async function geocodePlace(placeName) {
    try {
        const response = await axios.get(`${ORS_BASE_URL}/geocode/search`, {
            params: {
                api_key: process.env.ORS_API_KEY,
                text: placeName,
                size: 1
            }
        });

        if (response.data && response.data.features && response.data.features.length > 0) {
            return response.data.features[0].geometry.coordinates; // [lng, lat]
        }
        throw new Error(`Location not found: ${placeName}`);
    } catch (error) {
        console.error('Geocoding error:', error.response?.data || error.message);
        throw new Error(`Failed to geocode: ${placeName}`);
    }
}

/**
 * Calculates the minimum road distance between origin and destination using ORS.
 * 
 * @param {Array|string} origin - [lng, lat] coordinates or place name string
 * @param {Array|string} destination - [lng, lat] coordinates or place name string
 * @returns {Promise<Object>} { distance_km, duration_minutes, route_geometry }
 */
async function getRoadDistance(origin, destination) {
    try {
        if (!process.env.ORS_API_KEY) {
            throw new Error('ORS_API_KEY is not defined in environment variables');
        }

        let originCoords = origin;
        let destCoords = destination;

        // Geocode origin if it's a string
        if (typeof origin === 'string') {
            originCoords = await geocodePlace(origin);
        } else if (!Array.isArray(origin) || origin.length !== 2) {
            throw new Error('Invalid origin format. Must be a string or [lng, lat] array.');
        }

        // Geocode destination if it's a string
        if (typeof destination === 'string') {
            destCoords = await geocodePlace(destination);
        } else if (!Array.isArray(destination) || destination.length !== 2) {
            throw new Error('Invalid destination format. Must be a string or [lng, lat] array.');
        }

        // Call ORS Directions API
        const response = await axios.post(
            `${ORS_BASE_URL}/v2/directions/driving-car/geojson`,
            {
                coordinates: [originCoords, destCoords]
            },
            {
                headers: {
                    'Authorization': process.env.ORS_API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
                }
            }
        );

        if (!response.data || !response.data.features || response.data.features.length === 0) {
            throw new Error('No route found between the specified locations.');
        }

        const routeFeature = response.data.features[0];
        const properties = routeFeature.properties;

        // Convert distance from meters to kilometers, duration from seconds to minutes
        const distance_km = (properties.summary.distance / 1000).toFixed(2);
        const duration_minutes = Math.round(properties.summary.duration / 60);

        return {
            distance_km: parseFloat(distance_km),
            duration_minutes,
            route_geometry: routeFeature.geometry
        };

    } catch (error) {
        console.error('ORS API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || error.message || 'Failed to calculate route');
    }
}

module.exports = {
    getRoadDistance,
    geocodePlace
};

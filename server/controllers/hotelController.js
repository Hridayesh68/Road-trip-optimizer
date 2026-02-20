const axios = require('axios');
const mergeSort = require('../../algorithms/sorting/sortHotelsByPrice');

// @desc    Get hotels by city
// @route   GET /api/hotels/:city
// @access  Public
const getHotels = async (req, res) => {
    try {
        const { sortBy } = req.query;
        const city = req.params.city;

        // 1. Get Coordinates for the city via Nominatim
        const geocodeRes = await axios.get(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'RoadTripOptimizer/1.0' } }
        );

        if (!geocodeRes.data || geocodeRes.data.length === 0) {
            return res.status(404).json({ message: 'City not found' });
        }

        const lat = parseFloat(geocodeRes.data[0].lat);
        const lon = parseFloat(geocodeRes.data[0].lon);

        // 2. Query Overpass API for nearby hotels (within 10km)
        const overpassQuery = `
            [out:json][timeout:25];
            (
              node["tourism"="hotel"](around:10000,${lat},${lon});
              way["tourism"="hotel"](around:10000,${lat},${lon});
            );
            out center;
        `;

        const overpassRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        const elements = overpassRes.data.elements;

        // Map OpenStreetMap data to our expected Hotel schema and generate deterministic mock prices/ratings
        let hotels = elements.map((el, index) => {
            const id = el.id.toString();
            // Generate a deterministic pseudo-random price and rating based on the OSM ID
            const pseudoRandom = Math.abs(Math.sin(el.id)) * 10000;
            const price = Math.floor(1500 + (pseudoRandom % 8500)); // Price between 1500 - 10000₹
            const rating = (3.0 + (pseudoRandom % 20) / 10).toFixed(1); // Rating between 3.0 - 5.0

            // Map node coordinates vs way center coordinates
            const latitude = el.lat || (el.center && el.center.lat) || lat;
            const longitude = el.lon || (el.center && el.center.lon) || lon;

            return {
                _id: id,
                name: (el.tags && el.tags.name) ? el.tags.name : `${city} Hotel ${index + 1}`,
                city: city,
                price: price,
                rating: rating,
                amenities: ['WiFi', 'AC', 'Parking', 'Pool'].slice(0, Math.floor((pseudoRandom % 4)) + 1), // 1 to 4 amenities
                location: {
                    lat: latitude,
                    lng: longitude
                }
            };
        }).filter(h => h.name.toLowerCase() !== 'hotel' && h.name.toLowerCase() !== 'hotel null');

        hotels = hotels.slice(0, 10); // Limit to 10 hotels as requested

        if (sortBy === 'price_asc') {
            hotels = mergeSort(hotels, 'price', true);
        } else if (sortBy === 'price_desc') {
            hotels = mergeSort(hotels, 'price', false);
        } else if (sortBy === 'rating_desc') {
            hotels.sort((a, b) => b.rating - a.rating);
        }

        return res.status(200).json(hotels);
    } catch (err) {
        console.error("Overpass API Error, using fallback data:", err.message);

        // Return 10 fallback mock hotels if the API is down or rates limited
        const lat = 19.0760, lon = 72.8777; // Dummy coords
        const city = req.params.city || "Destination";
        const fallbackHotels = Array.from({ length: 10 }).map((_, index) => ({
            _id: `mock-${index}`,
            name: `${city} Grand Hotel ${index + 1}`,
            city: city,
            price: 2000 + (index * 500),
            rating: (4.0 + (index % 10) / 10).toFixed(1),
            amenities: ['WiFi', 'AC'],
            location: { lat: lat + (index * 0.01), lng: lon + (index * 0.01) }
        }));

        return res.status(200).json(fallbackHotels);
    }
};

module.exports = {
    getHotels,
};

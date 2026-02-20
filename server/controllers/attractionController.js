const axios = require('axios');

// @desc    Get attractions by city
// @route   GET /api/attractions/:city
// @access  Public
const getAttractions = async (req, res) => {
    try {
        const { category, minRating } = req.query;
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

        // Map frontend categories to OSM tags
        let osmTags = '"tourism"~"attraction|museum|viewpoint|gallery|theme_park"';
        if (category) {
            const catMap = {
                'Museum': '"tourism"="museum"',
                'Park': '"leisure"="park"',
                'Temple': '"amenity"="place_of_worship"',
                'Fort': '"historic"="castle"',
                'Beach': '"natural"="beach"',
                'Lake': '"natural"="water"'
            };
            if (catMap[category]) osmTags = catMap[category];
        }

        // 2. Query Overpass API for nearby attractions (within 10km)
        const overpassQuery = `
            [out:json][timeout:25];
            (
              node[${osmTags}](around:10000,${lat},${lon});
              way[${osmTags}](around:10000,${lat},${lon});
            );
            out center;
        `;

        const overpassRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        const elements = overpassRes.data.elements;

        // 3. Map OpenStreetMap data to our expected Attraction schema
        let attractions = elements.map((el, index) => {
            const id = el.id.toString();
            // Generate deterministic mock rating
            const pseudoRandom = Math.abs(Math.sin(el.id)) * 10000;
            const ratingNumber = parseFloat((3.5 + (pseudoRandom % 15) / 10).toFixed(1)); // Rating between 3.5 - 5.0

            const latitude = el.lat || (el.center && el.center.lat) || lat;
            const longitude = el.lon || (el.center && el.center.lon) || lon;

            const name = (el.tags && el.tags.name) ? el.tags.name : `${city} ${category || 'Attraction'} ${index + 1}`;

            // Derive generic category if not provided
            let itemCategory = category;
            if (!itemCategory && el.tags) {
                if (el.tags.tourism === 'museum') itemCategory = 'Museum';
                else if (el.tags.historic === 'castle') itemCategory = 'Fort';
                else if (el.tags.natural === 'beach') itemCategory = 'Beach';
                else itemCategory = 'Landmark';
            }

            return {
                _id: id,
                name: name,
                city: city,
                category: itemCategory || 'Landmark',
                rating: ratingNumber,
                description: `A fascinating ${itemCategory || 'place'} located in ${city}. Explore the culture and history.`,
                image: `https://source.unsplash.com/random/400x300?${encodeURIComponent(name.split(' ')[0])},india`,
                location: {
                    lat: latitude,
                    lng: longitude
                }
            };
        }).filter(a => a.name.length > 3 && !a.name.toLowerCase().includes('null'));

        // Filter by minRating if provided
        if (minRating) {
            attractions = attractions.filter(a => a.rating >= parseFloat(minRating));
        }

        // Limit to reasonable number
        attractions = attractions.slice(0, 15);

        return res.status(200).json(attractions);
    } catch (err) {
        console.error("Overpass API Error, using fallback data:", err.message);

        const lat = 19.0760, lon = 72.8777; // Dummy coords
        const city = req.params.city || "Destination";
        const cat = req.query.category || "Landmark";
        const fallbackAttractions = Array.from({ length: 10 }).map((_, index) => ({
            _id: `mock-attr-${index}`,
            name: `${city} Famous ${cat} ${index + 1}`,
            city: city,
            category: cat,
            rating: (4.0 + (index % 10) / 10).toFixed(1),
            description: `A fascinating ${cat} located in ${city}. Explore the culture and history.`,
            image: `https://source.unsplash.com/random/400x300?${encodeURIComponent(city.split(' ')[0])},tourist`,
            location: { lat: lat + (index * 0.01), lng: lon + (index * 0.01) }
        }));

        return res.status(200).json(fallbackAttractions);
    }
};

module.exports = {
    getAttractions,
};

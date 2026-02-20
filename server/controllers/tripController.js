const Trip = require('../models/Trip');
const buildGraph = require('../../algorithms/graph/buildGraph');
const tspSolver = require('../../algorithms/tsp/tspSolver');


// @desc    Optimize a trip route
// @route   POST /api/trips/optimize
// @access  Public (or Private)
const optimizeTrip = async (req, res) => {
    const { cities } = req.body;

    if (!cities || cities.length < 2) {
        return res.status(400).json({ message: 'At least two cities are required for optimization.' });
    }

    try {
        // 1. Build the graph (Adjacency Matrix) using Haversine distance
        const graph = buildGraph(cities);

        // 2. Solve TSP to get the optimal visit order
        const { route, totalDistance } = tspSolver(graph.adjacencyMatrix);

        // 3. Reorder the original cities array based on the optimized route indices
        const optimizedCities = route.map(index => cities[index]);

        res.status(200).json({
            originalCities: cities,
            optimizedRoute: optimizedCities,
            totalDistance: Math.round(totalDistance), // km
            visitOrder: route
        });
    } catch (error) {
        console.error("Optimization Error:", error);
        res.status(500).json({ message: 'Optimization failed', error: error.message });
    }
};

// @desc    Get user trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id });
        return res.status(200).json(trips);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch trips' });
    }
};

// @desc    Save a trip
// @route   POST /api/trips
// @access  Private
const saveTrip = async (req, res) => {
    try {
        const { cities, optimizedRoute, totalDistance, name } = req.body;

        if (!cities || !optimizedRoute) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const trip = await Trip.create({
            userId: req.user.id,
            cities,
            optimizedRoute,
            totalDistance,
            name
        });

        return res.status(201).json(trip);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save trip' });
    }
};

module.exports = {
    optimizeTrip,
    getTrips,
    saveTrip,
};

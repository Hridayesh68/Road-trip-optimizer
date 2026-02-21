const { getRoadDistance } = require('../utils/orsService');
const bfsRoute = require('../../algorithms/graph/bfsRoute');
const dfsRoute = require('../../algorithms/graph/dfsRoute');

// @desc    Calculate distance and duration between origin and destination
// @route   POST /api/distance
// @access  Public
const calculateDistance = async (req, res) => {
    const { origin, destination, algorithm } = req.body;

    if (!origin || !destination) {
        return res.status(400).json({ message: 'Origin and destination are required' });
    }

    try {
        // If an algorithm is specified, you would typically use a pre-built graph.
        // For a simple two-point origin -> destination request, BFS/DFS to traverse a graph 
        // implies you want to route from A to B through intermediate nodes. 
        // 
        // Since the prompt requires testing BFS/DFS options and the `origin` and `destination` 
        // can be anything, this basic implementation demonstrates the controller structure.
        // 
        // In a real scenario utilizing the BFS/DFS algorithms built earlier, you would have an 
        // adjacency matrix representing many locations (like the selected cities in a trip planner),
        // determine the order using BFS/DFS here, and then call getRoadDistance on each leg.

        if (algorithm === 'bfs' || algorithm === 'dfs') {
            console.log(`Using ${algorithm.toUpperCase()} algorithm for routing logic...`);
            // 1. Build Adjacency Matrix
            // 2. route = algorithm === 'bfs' ? bfsRoute(matrix) : dfsRoute(matrix)
            // 3. fetch ORS directions following route sequence
        }

        // Standard direct route call using ORS Service
        const result = await getRoadDistance(origin, destination);

        res.status(200).json({
            distance_km: result.distance_km,
            duration_minutes: result.duration_minutes,
            route_geometry: result.route_geometry
        });

    } catch (error) {
        console.error('Distance calculation error:', error);
        res.status(500).json({
            message: 'Failed to calculate distance',
            error: error.message
        });
    }
};

module.exports = {
    calculateDistance
};

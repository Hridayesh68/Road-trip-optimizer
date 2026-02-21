const express = require('express');
const router = express.Router();
const buildGraph = require('../algorithms/graph/buildGraph');
const dijkstra = require('../algorithms/graph/dijkstra');
const bfsRoute = require('../algorithms/graph/bfsRoute');
const dfsRoute = require('../algorithms/graph/dfsRoute');

// @desc    Run pathfinding algorithm for visualization
// @route   POST /api/algorithms/run
// @access  Public
router.post('/run', async (req, res) => {
    const { cities, algorithm } = req.body;

    if (!cities || cities.length < 2) {
        return res.status(400).json({ message: 'At least two cities are required.' });
    }

    try {
        const startTime = performance.now();
        let pathIndices = [];
        let visitedCount = 0;
        let totalDistance = 0;

        // 1. Build Adjacency Matrix using distance algorithm
        const graph = buildGraph(cities);
        const matrix = graph.adjacencyMatrix;

        // 2. Run selected algorithm
        switch (algorithm) {
            case 'dijkstra':
                // For Dijkstra, run from start node (0) to end node (cities.length - 1)
                const startNode = 0;
                const endNode = cities.length - 1;
                const result = dijkstra(matrix, startNode);

                // Reconstruct path backward
                let current = endNode;
                while (current !== null) {
                    pathIndices.unshift(current);
                    if (current === startNode) break;
                    current = result.previous[current];
                }

                // If it couldn't reach, just visit start
                if (pathIndices.length === 0 || pathIndices[0] !== startNode) {
                    pathIndices = [startNode];
                }

                // Calculate distance manually based on path for consistency
                for (let i = 0; i < pathIndices.length - 1; i++) {
                    totalDistance += matrix[pathIndices[i]][pathIndices[i + 1]];
                }

                // Dijkstra technically visits all reachable nodes to find shortest path
                visitedCount = result.distances.filter(d => d !== Infinity).length;
                break;

            case 'bfs':
                pathIndices = bfsRoute(matrix, 0);
                visitedCount = pathIndices.length;
                for (let i = 0; i < pathIndices.length - 1; i++) {
                    totalDistance += matrix[pathIndices[i]][pathIndices[i + 1]];
                }
                break;

            case 'dfs':
                pathIndices = dfsRoute(matrix, 0);
                visitedCount = pathIndices.length;
                for (let i = 0; i < pathIndices.length - 1; i++) {
                    totalDistance += matrix[pathIndices[i]][pathIndices[i + 1]];
                }
                break;

            default:
                return res.status(400).json({ message: 'Invalid algorithm selected' });
        }

        const endTime = performance.now();

        // 3. Map path back to actual city objects
        const route = pathIndices.map(index => cities[index]);

        res.status(200).json({
            route,
            totalDistance: Math.round(totalDistance),
            visitedNodes: visitedCount,
            executionTimeMs: Number((endTime - startTime).toFixed(2))
        });
    } catch (error) {
        console.error("Algorithm Error:", error);
        res.status(500).json({ message: 'Algorithm execution failed', error: error.message });
    }
});

module.exports = router;

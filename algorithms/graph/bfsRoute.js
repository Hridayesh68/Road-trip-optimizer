const buildDistanceMatrix = require('../utils/matrixBuilder');

/**
 * Breadth-First Search (BFS) for finding a path through nodes.
 * BFS is generally used for unweighted graphs to find the shortest path in terms of number of edges.
 * For our fully connected distance matrix, BFS will just explore level by level.
 * 
 * @param {Array} graph - An adjacency matrix of distances.
 * @param {number} startNode - Index of the starting node.
 * @returns {Array} List of node indices visited in BFS order.
 */
function bfsRoute(graphAdjacencyMatrix, startNode = 0) {
    const numNodes = graphAdjacencyMatrix.length;
    let visited = new Array(numNodes).fill(false);
    let queue = [];
    let traversalOrder = [];

    // Start with the initial node
    visited[startNode] = true;
    queue.push(startNode);

    while (queue.length > 0) {
        let currentNode = queue.shift();
        traversalOrder.push(currentNode);

        // Get neighbors (in a complete graph, this is all other unvisited nodes)
        // We iterate and sort by distance to at least make it somewhat "greedy" for this use case
        let neighbors = [];
        for (let i = 0; i < numNodes; i++) {
            if (!visited[i] && i !== currentNode) {
                neighbors.push({ index: i, distance: graphAdjacencyMatrix[currentNode][i] });
            }
        }

        // Sort neighbors by distance so BFS explores closest first
        neighbors.sort((a, b) => a.distance - b.distance);

        for (let neighbor of neighbors) {
            visited[neighbor.index] = true;
            queue.push(neighbor.index);
        }
    }

    return traversalOrder;
}

module.exports = bfsRoute;

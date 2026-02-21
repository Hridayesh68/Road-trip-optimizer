const buildDistanceMatrix = require('../utils/matrixBuilder');

/**
 * Depth-First Search (DFS) for finding a path through nodes.
 * DFS explores as far as possible along each branch before backtracking.
 * 
 * @param {Array} graph - An adjacency matrix of distances.
 * @param {number} startNode - Index of the starting node.
 * @returns {Array} List of node indices visited in DFS order.
 */
function dfsRoute(graphAdjacencyMatrix, startNode = 0) {
    const numNodes = graphAdjacencyMatrix.length;
    let visited = new Array(numNodes).fill(false);
    let traversalOrder = [];

    function dfsRecursive(currentNode) {
        visited[currentNode] = true;
        traversalOrder.push(currentNode);

        // Get neighbors
        let neighbors = [];
        for (let i = 0; i < numNodes; i++) {
            if (!visited[i] && i !== currentNode) {
                neighbors.push({ index: i, distance: graphAdjacencyMatrix[currentNode][i] });
            }
        }

        // Sort neighbors by distance to simulate a greedy depth approach
        neighbors.sort((a, b) => a.distance - b.distance);

        for (let neighbor of neighbors) {
            if (!visited[neighbor.index]) {
                dfsRecursive(neighbor.index);
            }
        }
    }

    dfsRecursive(startNode);

    return traversalOrder;
}

module.exports = dfsRoute;

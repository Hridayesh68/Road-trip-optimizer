const nearestNeighbor = require('./nearestNeighbor');
const twoOpt = require('./twoOptImprovement');

/**
 * Solves TSP using Nearest Neighbor followed by 2-Opt.
 * @param {Array<Array<number>>} distanceMatrix - Matrix of distances
 * @returns {Object} Best route found and distance
 */
function tspSolver(distanceMatrix) {
    // 1. Initial solution: Nearest Neighbor
    const nnResult = nearestNeighbor(distanceMatrix, 0);

    // 2. Improvement: 2-Opt
    const twoOptResult = twoOpt(nnResult.route, distanceMatrix);

    return twoOptResult;
}

module.exports = tspSolver;

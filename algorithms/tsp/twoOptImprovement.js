/**
 * 2-Opt local search to improve TSP tour.
 * @param {Array<number>} route - Initial tour (indices)
 * @param {Array<Array<number>>} distanceMatrix - Matrix of distances
 * @returns {Object} Improved route and new total distance
 */
function twoOpt(route, distanceMatrix) {
    let isImproved = true;
    let bestRoute = [...route];

    // Calculate initial distance
    let bestDistance = calculateTotalDistance(bestRoute, distanceMatrix);

    while (isImproved) {
        isImproved = false;
        for (let i = 1; i < bestRoute.length - 2; i++) {
            for (let j = i + 1; j < bestRoute.length - 1; j++) {
                const newRoute = twoOptSwap(bestRoute, i, j);
                const newDistance = calculateTotalDistance(newRoute, distanceMatrix);

                if (newDistance < bestDistance) {
                    bestRoute = newRoute;
                    bestDistance = newDistance;
                    isImproved = true;
                }
            }
        }
    }

    return { route: bestRoute, totalDistance: bestDistance };
}

function twoOptSwap(route, i, k) {
    const newRoute = route.slice(0, i);
    const segment = route.slice(i, k + 1).reverse();
    const end = route.slice(k + 1);
    return newRoute.concat(segment).concat(end);
}

function calculateTotalDistance(route, matrix) {
    let dist = 0;
    for (let i = 0; i < route.length - 1; i++) {
        dist += matrix[route[i]][route[i + 1]];
    }
    return dist;
}

module.exports = twoOpt;

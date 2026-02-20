/**
 * Nearest Neighbor heuristic for TSP.
 * @param {Array<Array<number>>} distanceMatrix - Matrix of distances
 * @param {number} startCityIndex - Index of starting city (default 0)
 * @returns {Object} Route (array of indices) and totalDistance
 */
function nearestNeighbor(distanceMatrix, startCityIndex = 0) {
    const n = distanceMatrix.length;
    const visited = new Set();
    const route = [startCityIndex];
    visited.add(startCityIndex);

    let currentCity = startCityIndex;
    let totalDistance = 0;

    while (visited.size < n) {
        let nearestCity = -1;
        let minDistance = Infinity;

        for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
                const dist = distanceMatrix[currentCity][i];
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestCity = i;
                }
            }
        }

        if (nearestCity !== -1) {
            visited.add(nearestCity);
            route.push(nearestCity);
            totalDistance += minDistance;
            currentCity = nearestCity;
        }
    }

    // Return to start
    totalDistance += distanceMatrix[currentCity][startCityIndex];
    route.push(startCityIndex);

    return { route, totalDistance };
}

module.exports = nearestNeighbor;

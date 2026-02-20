/**
 * Quick Sort for attractions.
 * @param {Array} attractions - Array of attraction objects
 * @param {string} key - Property to sort by (e.g., 'rating')
 * @param {boolean} ascending - Check true for ascending order
 * @returns {Array} Sorted array
 */
function quickSort(attractions, key = 'rating', ascending = false) {
    if (attractions.length <= 1) return attractions;

    const pivot = attractions[attractions.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < attractions.length - 1; i++) {
        const val = attractions[i][key];
        const pVal = pivot[key];

        if (ascending ? val < pVal : val > pVal) {
            left.push(attractions[i]);
        } else {
            right.push(attractions[i]);
        }
    }

    return [...quickSort(left, key, ascending), pivot, ...quickSort(right, key, ascending)];
}

module.exports = quickSort;

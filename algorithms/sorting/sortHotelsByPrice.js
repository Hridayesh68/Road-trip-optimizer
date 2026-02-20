/**
 * Merges two sorted arrays of hotels.
 */
function merge(left, right, key, ascending) {
    let sortedArr = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        const lVal = left[leftIndex][key];
        const rVal = right[rightIndex][key];

        let condition = ascending ? lVal < rVal : lVal > rVal;

        // Handle equal values (stable sort preferred, but basic is fine)
        if (lVal === rVal) condition = true; // Stable-ish for left first

        if (condition) {
            sortedArr.push(left[leftIndex]);
            leftIndex++;
        } else {
            sortedArr.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return sortedArr.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

/**
 * Sorts hotels using Merge Sort.
 * @param {Array} hotels - Array of hotel objects
 * @param {string} key - Property to sort by (e.g., 'price')
 * @param {boolean} ascending - Check true for ascending order
 * @returns {Array} Sorted array
 */
function mergeSort(hotels, key = 'price', ascending = true) {
    if (!Array.isArray(hotels) || hotels.length <= 1) return hotels;

    const mid = Math.floor(hotels.length / 2);
    const left = mergeSort(hotels.slice(0, mid), key, ascending);
    const right = mergeSort(hotels.slice(mid), key, ascending);

    return merge(left, right, key, ascending);
}

module.exports = mergeSort;

import { createWasmArray } from "./create.js";

/**
 * Helper utility to determine the length of a subset, for use in allocations.
 *
 * @param {(Array|TypedArray|WasmArray)} subset - Array specifying the subset to retain or filter out, depending on `filter`.
 * See the argument of the same name in {@linkcode subsetWasmArray} for more details.
 * @param {?boolean} filter - How to interpret `subset`.
 * See the argument of the same name in {@linkcode subsetWasmArray} for more details.
 * @param {number} targetLength - Length of the target vector to be subsetted by `subset`.
 * @param {string} targetName - Name of the target vector, for use in error messages.
 *
 * @return {number} Length of the subsetted vector.
 */
export function checkSubsetLength(subset, filter, targetLength, targetName) {
    if (filter === null) {
        subset.forEach(i => {
            if (i < 0 || i >= targetLength) {
                throw new Error("'subset' contains out-of-range indices for '" + targetName + "'");
            }
        });
        return subset.length;
    } 

    if (subset.length != targetLength) {
        throw new Error("'subset' and '" + targetName + "' should have the same length");
    }

    let sum = 0;
    subset.forEach(x => { sum += (x != 0); });
    if (filter) {
        return subset.length - sum;
    } 

    return sum;
}

/**
 * Helper utility to fill a subset from one TypedArray to another.
 *
 * @param {(Array|TypedArray|WasmArray)} subset - Array specifying the subset to retain or filter out, depending on `filter`.
 * See the argument of the same name in {@linkcode subsetWasmArray} for more details.
 * @param {?boolean} filter - How to interpret `subset`.
 * See the argument of the same name in {@linkcode subsetWasmArray} for more details.
 * @param {TypedArray} input - Input array to subset.
 * @param {TypedArray} output - Output array to store the subset, of length defined by {@linkcode checkSubsetLength}.
 *
 * @return `output` is filled with the specified subset of values from `input`.
 */
export function fillSubset(subset, filter, input, output) {
    if (filter == null) {
        subset.forEach((s, i) => {
            output[i] = input[s];
        });
    } else if (filter) {
        let j = 0;
        subset.forEach((y, i) => {
            if (y == 0) {
                output[j] = input[i];
                j++;
            }
        });
    } else {
        let j = 0;
        subset.forEach((y, i) => {
            if (y !== 0) {
                output[j] = input[i];
                j++;
            }
        });
    }
}

/**
 * Create a new WasmArray from a subset of an existing WasmArray.
 * 
 * @param {WasmArray} x - The input WasmArray.
 * @param {(Array|TypedArray|WasmArray)} subset - Array specifying the subset to retain or filter out, depending on `filter`.
 * 
 * If `filter = null`, the array is expected to contain integer indices specifying the entries in `x` to retain.
 * The ordering of indices in `subset` will be respected in the subsetted array.
 *
 * If `filter = true`, the array should be of length equal to that of `x`.
 * Each value is interpreted as a boolean and, if truthy, indicates that the corresponding entry of `x` should be filtered out.
 *
 * If `filter = false`, the array should be of length equal to that of `x`.
 * Each value is interpreted as a boolean and, if truthy, indicates that the corresponding entry of `x` should be retained.
 *
 * Note that TypedArray views on Wasm-allocated buffers should only be provided if `buffer` is also provided;
 * otherwise, a Wasm memory allocation may invalidate the view.
 * @param {object} [options={}] - Optional parameters.
 * @param {?boolean} [options.filter=null] - Whether to retain truthy or falsey values in a `subset` boolean filter.
 * If `null`, `subset` should instead contain the indices of elements to retain.
 * @param {?WasmArray} [options.buffer=null] - Array in which the output is to be stored.
 * If provided, this should be of length equal to `subset`, if `filter = null`; 
 * the number of truthy elements in `subset`, if `filter = false`;
 * or the number of falsey elements in `subset`, if `filter = true`.
 *
 * @return {WasmArray} Array of the same type of `x` and in the same space, containing the desired subset `subset`.
 * If `buffer` is supplied, it is directly returned.
 */
export function subsetWasmArray(x, subset, { filter = null, buffer = null } = {}) {
    let len = checkSubsetLength(subset, filter, x.length, "x"); 

    if (buffer == null) {
        // Function better be a no-throw from now on.
        buffer = createWasmArray(x.space, len, x.constructor);
    } else if (buffer.length !== len) {
        throw new Error("length of 'buffer' is not consistent with 'subset'");
    }

    let barr = buffer.array();
    let xarr = x.array();
    fillSubset(subset, filter, xarr, barr);

    return buffer;
}

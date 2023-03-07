import { createWasmArray } from "./create.js";

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
    let len = 0;
    if (filter === null) {
        len = subset.length;
    } else {
        if (subset.length != x.length) {
            throw new Error("'x' and 'filter' should have the same length");
        }

        let sum = 0;
        subset.forEach(x => { sum += (x != 0); });
        if (filter) {
            len = subset.length - sum;
        } else {
            len = sum;
        }
    }

    if (buffer == null) {
        // Function better be a no-throw from now on.
        buffer = createWasmArray(x.space, len, x.constructor);
    } else if (buffer.length !== len) {
        throw new Error("length of 'buffer' is not consistent with 'subset'");
    }

    let barr = buffer.array();
    let xarr = x.array();

    if (filter == null) {
        subset.forEach((s, i) => {
            barr[i] = xarr[s];
        });
    } else if (filter) {
        let j = 0;
        subset.forEach((y, i) => {
            if (y == 0) {
                barr[j] = xarr[i];
                j++;
            }
        });
    } else {
        let j = 0;
        subset.forEach((y, i) => {
            if (y !== 0) {
                barr[j] = xarr[i];
                j++;
            }
        });
    }

    return buffer;
}

import { allocate, release, buffer } from "./globals.js";

/** 
 * Wrapper around an array allocated on the Wasm heap.
 * This handles the memory management so that users don't have to manually free allocations 
 * (unless they want to, e.g., because they don't trust the timeliness of the Javascript engine's garbage collector).
 * Users should not construct WasmArray instances directly; use the {@linkcode createWasmArray} function instead.
 *
 * @hideconstructor
 */
export class WasmArray {
    #space;
    #id;
    #length;
    #offset;
    #owner;

    // See documentation below for details on each argument.
    constructor(space, id, length, offset, owner) {
        this.#space = space;
        this.#id = id;
        this.#length = length;
        this.#offset = offset;
        this.#owner = owner;
    }

    /**
     * @member {number}
     * @desc Identifier for the Wasm memory space.
     */
    get space() {
        return this.#space;
    }

    /**
     * @member {number}
     * @desc Identifier for this array in the specified space.
     * This may not have any meaningful value if this WasmArray instance is a view, see the {@linkcode WasmArray#owner owner} property for details.
     */
    get id() {
        return this.#id;
    }

    /**
     * @member {number}
     * @desc Offset on the Wasm heap, in terms of the number of bytes.
     */
    get offset() {
        return this.#offset;
    }

    /**
     * @member {number}
     * @desc Same as {@linkcode WasmArray#offset offset}, provided for consistency with the TypedArray interface.
     */
    get byteOffset() {
        return this.#offset;
    }

    /**
     * @member {ArrayBuffer}
     * @desc The ArrayBuffer used to implement the Wasm heap, on which the current array is allocated.
     */
    get buffer() {
        return buffer(this.#space);
    }

    /**
     * @member {number}
     * @desc Length of the heap allocation, in terms of the number of bytes.
     */
    get byteLength() {
        return this.length * this.constructor.valueSize;
    }

    /**
     * @member {number}
     * @desc Length of the array, in terms of the number of elements.
     */
    get length() {
        return this.#length;
    }

    /**
     * @member {(object|WasmArray)}
     *
     * @desc
     * This property contains information about the owner of the allocation on the Wasm heap.
     * The most common value of this property will be `null`, indicating that the current WasmArray instance is the owner of the allocation on the Wasm heap.
     * This is the only setting where {@linkcode WasmArray#free free} has any effect.
     *
     * Any non-`null` value indicates that the current instance is just a view into an allocation owned by another entity.
     * If the value is a reference to another WasmArray, then the returned object is the actual owner of the allocation.
     *
     * In some cases, `owner` may be an empty (non-`null`) object.
     * This indicates that the allocation is owned by some unknown entity, e.g., a view directly returned by Emscripten's bindings without involving a WasmArray instance.
     */
    get owner() {
        return this.#owner;
    }

    /**
     * Fill the array with a constant number.
     *
     * @param {number} x - Number to use to fill the array.
     * @param {number} [start] Position on the array to start filling.
     * Defaults to the start of the array.
     * @param {number} [end] Position on the array to stop filling.
     * Defaults to the end of the array.
     * Only used if `start` is specified.
     *
     * @return {TypedArray} The array (or its specified subinterval) is filled with `x`.
     * A TypedArray view of the current WasmArray is returned.
     */
    fill(x, start, end) {
        let y = this.array();
        y.fill(...arguments);
        return y;
    }

    /**
     * Set the array elements to the contents of an existing array.
     *
     * @param {(Array|TypedArray)} x - Source array containing the values to fill the current array.
     * @param {number} [offset] - Position on this array to start setting to `x`.
     * Defaults to the start of the array.
     *
     * @return Entries of this array (starting from `offset`, if specified) are set to `x`.
     */
    set(x, offset) {
        this.array().set(...arguments);
        return;
    }

    /**
     * Create a TypedArray slice of the data in the allocated array.
     *
     * @param {number} [start] - Position on this array to start slicing.
     * Defaults to the start of the array.
     * @param {number} [end] - Position on the array to end slicing.
     * Defaults to the end of the array.
     * Only used if `start` is specified.
     *
     * @return {TypedArray} A TypedArray containing the specified subarray of this WasmArray.
     * This is not a view on the Wasm heap and thus can be safely used after any further Wasm allocations.
     */
    slice(start, end) {
        return this.array().slice(...arguments);
    }

    /**
     * Create a WasmArray clone of this object.
     *
     * @param {number} space - Identifier for the Wasm memory space.
     * If not specified, we use the memory space of this object.
     *
     * @return {WasmArray} A new WasmArray of the same type as this WasmArray, and filled with the same contents.
     * This refers to a separate allocation on the requested space.
     */
    clone(space) {
        if (typeof space === "undefined") {
            space = this.#space;
        }
        let output = allocate(space, this.#length, this.constructor);
        output.set(this.array());
        return output;
    }

    /**
     * Create a WasmArray "view" of the data in this object.
     *
     * @param {number} [start] - Position on this array to start the view.
     * Defaults to the start of the array.
     * @param {number} [end] - Position on the array to end the view.
     * Defaults to the end of the array.
     * Only used if `start` is specified.
     *
     * @return {WasmArray} A WasmArray containing a view on the specified subarray of this WasmArray.
     *
     * The returned object does not own the memory on the Wasm heap, so {@linkcode WasmArray#free free} will not have any effect.
     * It does, however, hold a reference to its parent object, i.e., the current WasmArray instance on which `view` was called.
     * This reference ensures that the parent is not prematurely garbage collected, which would invalidate the view when the Wasm allocation is freed.
     * Of course, all views will be invalidated if the parent's {@linkcode WasmArray#free free} method is invoked manually.
     */
    view(start, end) {
        if (typeof start === "undefined") {
            start = 0;
        }
        if (typeof end === "undefined") {
            end = this.#length;
        }

        let new_length = end - start;
        let original_parent = this.#owner;
        if (original_parent === null) {
            original_parent = this;
        }

        let adjust = start * this.constructor.valueSize;
        return new this.constructor(this.#space, -1, new_length, this.#offset + adjust, original_parent);
    }

    /**
     * Free the allocated Wasm memory if this object owns that memory.
     *
     * @return If this object is the owner, memory is freed and this allocation is invalidated.
     *
     * If this object is a view, this function is a no-op.
     * If this function was previously called, further calls will have no effect.
     */
    free() {
        if (this.#owner === null && this.#offset !== null) {
            release(this.#space, this.#id);
            this.#offset = null;
        }
    }

    /**
     * Iterate across the values of the WasmArray.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur during iteration.
     *
     * @return {object} An array iterator object.
     */
    [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Iterate across the values of the WasmArray.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur during iteration.
     *
     * @return {object} An array iterator object.
     */
    values() {
        return this.array().values();
    }

    /**
     * Iterate across the keys (i.e., indices) of the WasmArray.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur during iteration.
     *
     * @return {object} An array iterator object.
     */
    keys() {
        return this.array().keys();
    }

    /**
     * Obtain the value at the specified index.
     *
     * @param {number} index - Position of the array.
     * This may be negative to indicate indexing from the end of the array.
     *
     * @return {number} The value of the array at the requested index.
     */
    at(index) {
        return this.array().at(index);
    }

    /**
     * Apply a callback function to each element in the array, equivalent to the counterpart for Arrays.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the callback.
     *
     * @param {function} callbackFn - Callback function to be applied to each array element, 
     * see the documentation for [`TypedArray.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/forEach).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return `callBack` is applied to each element of the array. 
     */
    forEach(callbackFn, thisArg) {
        this.array().forEach(...arguments);
        return;
    }

    /**
     * Create a new TypedArray containing all elements in the WasmArray that pass the filter.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the filter.
     *
     * @param {function} callbackFn - Callback function defining a filter,
     * see the documentation for [`TypedArray.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/filter).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return {TypedArray} A TypedArray that contains only the elements passing the filter.
     * This is not a view on the Wasm heap and thus can be safely used after any further Wasm allocations.
     */
    filter(callbackFn, thisArg) {
        return this.array().filter(...arguments);
    }

    /**
     * Create a new TypedArray from evaluating the callback function on each element of the WasmArray.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the callback.
     *
     * @param {function} callbackFn - Callback function that defines the mapping, 
     * see the documentation for [`TypedArray.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/map).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return {TypedArray} A TypedArray containing the result of `callbackFn` on each element.
     * This is not a view on the Wasm heap and thus can be safely used after any further Wasm allocations.
     */
    map(callbackFn, thisArg) { 
        return this.array().map(...arguments);
    }

    /**
     * Create a TypedArray view for a range of the current WasmArray from `[begin, end)`.
     *
     * @param {number} [begin] - Index of the starting element, defaults to 0.
     * @param {number} [end] - Index of the final element plus 1, defaults to the length of the current array.
     *
     * @return {TypedArray} A TypedArray view of the requested subarray.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur during iteration.
     */
    subarray(begin, end) {
        return this.array().subarray(begin, end);
    }

    /**
     * Test whether every element in the WasmArray passes the test implemented by the callback function.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the callback.
     *
     * @param {function} callbackFn - Callback function defining a condition for each array element, 
     * see the documentation for [`TypedArray.prototype.every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/every).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return {boolean} Whether the callback is truthy for each element in the WasmArray.
     */
    every(callbackFn, thisArg) {
        return this.array().every(...arguments);
    }

    /**
     * Test whether any element in the WasmArray passes the test implemented by the callback function.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the callback.
     *
     * @param {function} callbackFn - Callback function defining a condition for each array element, 
     * see the documentation for [`TypedArray.prototype.some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/some).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return {boolean} Whether the callback is truthy for any element in the WasmArray.
     */
    some(callbackFn, thisArg) {
        return this.array().some(...arguments);
    }

    /**
     * Reduce the WasmArray into a single value by repeatedly applying a callback function from left to right.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the callback.
     *
     * @param {function} callbackFn - Callback function defining a reduction operation,
     * see the documentation for [`TypedArray.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reduce).
     * @param {*} [initialValue] - Initial value of the accumulator.
     *
     * @return {*} Result of the callback function.
     */
    reduce(callbackFn, initialValue) {
        return this.array().reduce(...arguments);
    }

    /**
     * Reduce the WasmArray into a single value by repeatedly applying a callback function from right to left.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the callback.
     *
     * @param {function} callbackFn - Callback function defining the reduction operation,
     * see the documentation for [`TypedArray.prototype.reduceRight`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reduceRight).
     * @param {*} [initialValue] - Initial value of the accumulator.
     *
     * @return {*} Result of the callback function.
     */
    reduceRight(callbackFn, initialValue) {
        return this.array().reduceRight(...arguments);
    }

    /**
     * Sort the contents of the WasmArray.
     * Note that this relies on a TypedArray view and may not be valid if any Wasm heap allocations occur in the comparison function.
     *
     * @param {function} compareFn - Function to define the sort order, 
     * see the documentation for [`TypedArray.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/sort).
     *
     * @return {TypedArray} The contents of the WasmArray are sorted in-place, and a TypedArray view is returned.
     */
    sort(compareFn) {
        return this.array().sort(compareFn);
    }
    
    /**
     * Reverse the contents of the WasmArray.
     *
     * @return {TypeArray} The contents of the WasmArray are reversed in-place, and a TypedArray view is returned.
     */
    reverse() {
        return this.array().reverse();
    }
}

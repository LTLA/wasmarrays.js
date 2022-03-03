import { allocate, release } from "./globals.js";

/** 
 * Wrapper around an array allocated on the Wasm heap.
 * This handles the memory management so that users don't have to manually free allocations 
 * (unless they want to, e.g., because they don't trust the timeliness of the Javascript engine's garbage collector).
 */
export class WasmArray {
    #space;
    #id;
    #length;
    #offset;
    #owner;

    /**
     * @param {number} space - Identifier for the Wasm memory space, as returned by {@linkcode register}.
     * @param {number} id - Identifier for this array in the specified space.
     * @param {number} length - Length of the array, in terms of the number of elements.
     * @param {number} offset - Offset on the Wasm heap.
     * @param {(WasmArray|object)} owner - Owner of the memory, see the {@linkcode WasmArray#owner owner} property for more details about acceptable values.
     *
     * @desc Users should not call this constructor directly; use the {@linkcode createWasmArray} function instead.
     */
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
     * @desc Length of the array, in terms of the number of elements (not bytes).
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
     * @return The array (or its specified subinterval) is filled with values from `x`.
     */
    fill(x, start, end) {
        if (typeof start === "undefined") {
            this.array().fill(x);
        } else if (typeof end === "undefined") {
            this.array().fill(x, start);
        } else {
            this.array().fill(x, start, end);
        }
        return;
    }

    /**
     * Set the array elements to the contents of an existing array.
     *
     * @param {(Array|TypedArray)} x - Source array containing the values to fill the current array.
     * @param {?number} [offset] - Position on this array to start setting to `x`.
     * Defaults to the start of the array.
     *
     * @return Entries of this array (starting from `offset`, if specified) are set to `x`.
     */
    set(x, offset) {
        if (typeof offset === "undefined") {
            this.array().set(x);
        } else {
            this.array().set(x, offset);
        }
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
     * @return A TypedArray containing the specified subarray.
     * This is not a view on the Wasm heap and thus can be safely used after any further Wasm allocations.
     */
    slice(start, end) {
        if (typeof start === "undefined") {
            return this.array().slice();
        } else if (typeof end === "undefined") {
            return this.array().slice(start);
        } else {
            return this.array().slice(start, end);
        }
    }

    /**
     * Create a WasmArray clone of this object.
     *
     * @param {number} space - Identifier for the Wasm memory space.
     * If not specified, we use the memory space of this object.
     *
     * @return A new WasmArray of the same type and filled with the same contents.
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
     * @return A WasmArray containing a view on the specified subarray.
     *
     * The returned object does not own the memory on the Wasm heap, so {@linkcode WasmArray#free free} will not have any effect.
     * It does, however, hold a reference to its parent object, i.e., the current WasmArray instance on which `view` was called.
     * This reference ensures that the parent is not prematurely garbage collected (thus invalidating the view when the Wasm allocation is freed).
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
     *
     * @return An array iterator function.
     */
    [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Iterate across the values of the WasmArray.
     *
     * @return An array iterator function.
     */
    values() {
        return this.array().values();
    }

    /**
     * Iterate across the keys (i.e., indices) of the WasmArray.
     *
     * @return An array iterator function.
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
     * @return The value of the array at the requested index.
     */
    at(index) {
        return this.array().at(index);
    }

    /**
     * Apply a function to each element in the array, equivalent to the counterpart for Arrays.
     *
     * @param {function} callbackFn - Callback function, see the documentation for [`TypedArray.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/forEach).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return `undefined`.
     */
    forEach(callbackFn, thisArg) {
        this.array().forEach(callbackFn, thisArg);
        return;
    }

    /**
     * Create a new TypedArray with all elements that pass the filter.
     *
     * @param {function} callbackFn - Callback function, see the documentation for [`TypedArray.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/filter).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return A TypedArray that contains only the elements passing the filter.
     */
    filter(callbackFn, thisArg) {
        return this.array().filter(callbackFn, thisArg);
    }

    /**
     * Create a new TypedArray from evaluating the callback on each element.
     *
     * @param {function} callbackFn - Callback function, see the documentation for [`TypedArray.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/map).
     * @param {object} [thisArg] - Value to use as `this` when executing `callbackFn`.
     *
     * @return A TypedArray containing the result of `callbackFn` on each element.
     */
    map(callbackFn, thisArg) { 
        return this.array().map(callbackFn, thisArg);
    }
}

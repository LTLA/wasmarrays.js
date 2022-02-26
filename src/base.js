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
     * @param {number} space - Identifier for the Wasm memory space.
     * @param {number} id - Identifier for this array in the specified space.
     * @param {number} length - Length of the array.
     * @param {number} offset - Offset on the Wasm heap.
     * @param {boolean} owner - Whether this instance owns the allocation.
     * If `false`, it is treated as a view on the heap.
     *
     * Users should not be calling the constructor directly;
     * use the `createWasmArray()` function instead.
     */
    constructor(space, id, length, offset, owner) {
        this.#space = space;
        this.#id = id;
        this.#length = length;
        this.#offset = offset;
        this.#owner = owner;
    }

    /**
     * @return Identifier for the Wasm memory space.
     */
    get space() {
        return this.#space;
    }

    /**
     * @return Identifier for this array in the specified space.
     */
    get id() {
        return this.#id;
    }

    /**
     * @return Offset on the Wasm heap.
     */
    get offset() {
        return this.#offset;
    }

    /**
     * @return Length of the array.
     */
    get length() {
        return this.#length;
    }

    /**
     * @return Whether this object owns the allocation.
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
     * Create a `TypedArray` slice of the data in the allocated array.
     *
     * @param {number} [start] - Position on this array to start slicing.
     * Defaults to the start of the array.
     * @param {number} [end] - Position on the array to end slicing.
     * Defaults to the end of the array.
     * Only used if `start` is specified.
     *
     * @return A `TypedArray` containing the specified subarray.
     * This is not a view on the Wasm heap and thus can continue to be used after Wasm allocations.
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
     * Create a `WasmArray` clone of this object.
     *
     * @return A new `WasmArray` of the same type and filled with the same contents.
     * This refers to a separate allocation on the same memory space as this object.
     */
    clone() {
        let output = allocate(this.#space, this.#length, this.constructor);
        output.set(this.array());
        return output;
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
}

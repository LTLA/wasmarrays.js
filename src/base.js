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
     * @param {(WasmArray|object)} owner - Owner of the memory, see the `owner` property for more details about acceptable values.
     *
     * Users should not be calling this constructor directly;
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
     * This may not have any meaningful value if this `WasmArray` instance is a view, see the `owner` property.
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
     * @return Information about the owner of the allocation on the Wasm heap.
     *
     * The most common return value will be `null`, in which case the current `WasmArray` instance owns its own allocation.
     * This is the only setting where `free()` has any effect.
     *
     * Any non-`null` value indicates that the current instance is just a view into an allocation owned by another entity.
     * If `owner()` returns a reference to another `WasmArray`, then the returned object is the actual owner of the allocation.
     *
     * In some cases, `owner()` may return an empty (non-`null`) object.
     * This indicates that the allocation is owned by some unknown entity, e.g., a view directly returned by Emscripten's bindings without using `WasmArray`.
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
     * @param {number} space - Identifier for the Wasm memory space.
     * If not specified, we use the memory space of this object.
     *
     * @return A new `WasmArray` of the same type and filled with the same contents.
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
     * Create a `WasmArray` "view" of the data in this object.
     *
     * @param {number} [start] - Position on this array to start the view.
     * Defaults to the start of the array.
     * @param {number} [end] - Position on the array to end the view.
     * Defaults to the end of the array.
     * Only used if `start` is specified.
     *
     * @return A `WasmArray` containing a view on the specified subarray.
     *
     * The returned object does not own the memory on the Wasm heap, so `free()` will not have any effect.
     * It does, however, hold a reference to its parent object, i.e., the `WasmArray` instance on which `view()` was called.
     * This reference avoids premature garbage collection of the parent and inadvertent invalidation of the views.
     * Of course, all views will be invalidated if the parent's `free()` method is invoked manually.
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
}

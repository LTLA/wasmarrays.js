import { 
    Int8WasmArray, Uint8WasmArray,
    Int16WasmArray, Uint16WasmArray,
    Int32WasmArray, Uint32WasmArray,
    BigInt64WasmArray, BigUint64WasmArray,
    Float32WasmArray, Float64WasmArray
} from "./derived.js";

/**
 * Create a {@linkplain WasmArray} view of the specified subclass.
 * It is assumed that some unknown entity owns the Wasm heap allocation;
 * for example, Emscripten-defined bindings on C++ classes that own array data,
 * where it may be of interest to wrap these arrays in WasmArray instances for downstream processing.
 * The caller is responsible for ensuring that the lifetime of the returned WasmArray view does not exceed that of the owner.
 * Note that this function differs from {@linkcode WasmArray#view WasmArray.view}, which creates a WasmArray view from an exising WasmArray.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * This may need to be a certain multiple of 2, 4 or 8, depending on `arrayClass`.
 * @param {class} arrayClass - Desired subclass of the {@linkplain WasmArray}.
 * 
 * @return {WasmArray} Instance of a {@linkplain WasmArray} subclass containing a view on the heap.
 */
export function createWasmArrayView(space, length, offset, arrayClass) {
    return new arrayClass(space, -1, length, offset, {});
}

/**
 * Create a {@linkplain Uint8WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Uint8WasmArray} Instance of a {@linkplain Uint8WasmArray} view.
 */
export function createUint8WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Uint8WasmArray); 
}

/**
 * Create an {@linkplain Int8WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Int8WasmArray} Instance of an {@linkplain Int8WasmArray} view.
 */
export function createInt8WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Int8WasmArray); 
}

/**
 * Create a {@linkplain Uint16WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Uint16WasmArray} Instance of a {@linkplain Uint16WasmArray} view.
 */
export function createUint16WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Uint16WasmArray); 
}

/**
 * Create an {@linkplain Int16WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Int16WasmArray} Instance of an {@linkplain Int16WasmArray} view.
 */
export function createInt16WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Int16WasmArray); 
}

/**
 * Create a {@linkplain Uint32WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Uint32WasmArray} Instance of a {@linkplain Uint32WasmArray} view.
 */
export function createUint32WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Uint32WasmArray); 
}

/**
 * Create an {@linkplain Int32WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Int32WasmArray} Instance of an {@linkplain Int32WasmArray} view.
 */
export function createInt32WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Int32WasmArray); 
}

/**
 * Create a {@linkplain BigUint64WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {BigUint64WasmArray} Instance of a {@linkplain BigUint64WasmArray} view.
 */
export function createBigUint64WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, BigUint64WasmArray); 
}

/**
 * Create an {@linkplain BigInt64WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {BigInt64WasmArray} Instance of an {@linkplain BigInt64WasmArray} view.
 */
export function createBigInt64WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, BigInt64WasmArray); 
}


/**
 * Create a {@linkplain Float32WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Float32WasmArray} Instance of a {@linkplain Float32WasmArray} view.
 */
export function createFloat32WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Float32WasmArray); 
}

/**
 * Create a {@linkplain Float64WasmArray} view on Wasm memory owned by some unknown entity (see {@linkcode createWasmArrayView} for details).
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return {Float64WasmArray} Instance of a {@linkplain Float64WasmArray} view.
 */
export function createFloat64WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Float64WasmArray); 
}

import { 
    Int8WasmArray, Uint8WasmArray,
    Int16WasmArray, Uint16WasmArray,
    Int32WasmArray, Uint32WasmArray,
    Float32WasmArray, Float64WasmArray
} from "./derived.js";

/**
 * Create a {@linkplain WasmArray} view of the specified subclass.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * This may need to be a certain multiple of 2, 4 or 8, depending on `arrayClass`.
 * @param {class} arrayClass - Desired subclass of the {@linkplain WasmArray}.
 * 
 * @return Instance of a {@linkplain WasmArray} subclass containing a view on the heap.
 */
export function createWasmArrayView(space, length, offset, arrayClass) {
    return new arrayClass(space, -1, length, offset, {});
}

/**
 * Create a {@linkplain Uint8WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of a {@linkplain Uint8WasmArray} view.
 */
export function createUint8WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Uint8WasmArray); 
}

/**
 * Create an {@linkplain Int8WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of an {@linkplain Int8WasmArray} view.
 */
export function createInt8WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Int8WasmArray); 
}

/**
 * Create a {@linkplain Uint16WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of a {@linkplain Uint16WasmArray} view.
 */
export function createUint16WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Uint16WasmArray); 
}

/**
 * Create an {@linkplain Int16WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of an {@linkplain Int16WasmArray} view.
 */
export function createInt16WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Int16WasmArray); 
}

/**
 * Create a {@linkplain Uint32WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of a {@linkplain Uint32WasmArray} view.
 */
export function createUint32WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Uint32WasmArray); 
}

/**
 * Create an {@linkplain Int32WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of an {@linkplain Int32WasmArray} view.
 */
export function createInt32WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Int32WasmArray); 
}

/**
 * Create a {@linkplain Float32WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of a {@linkplain Float32WasmArray} view.
 */
export function createFloat32WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Float32WasmArray); 
}

/**
 * Create a {@linkplain Float64WasmArray} view.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the view, in terms of the number of data elements.
 * @param {number} offset - Offset on the Wasm heap to start the view.
 * 
 * @return Instance of a {@linkplain Float64WasmArray} view.
 */
export function createFloat64WasmArrayView(space, length, offset) { 
    return createWasmArrayView(space, length, offset, Float64WasmArray); 
}

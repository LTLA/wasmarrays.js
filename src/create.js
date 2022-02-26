import { allocate } from "./globals.js";
import { 
    Int8WasmArray, Uint8WasmArray,
    Int16WasmArray, Uint16WasmArray,
    Int32WasmArray, Uint32WasmArray,
    Float32WasmArray, Float64WasmArray
} from "./derived.js";

/**
 * Create a `WasmArray` of the specified subclass.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * @param {class} arrayClass - Subclass of the `WasmArray`.
 * 
 * @return Instance of a `WasmArray` subclass.
 */
export function createWasmArray(space, length, arrayClass) {
    return allocate(space, length, arrayClass);
}

/**
 * Create a `Uint8WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Uint8WasmArray`.
 */
export function createUint8WasmArray(space, length) { 
    return createWasmArray(space, length, Uint8WasmArray); 
}

/**
 * Create a `Int8WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Int8WasmArray`.
 */
export function createInt8WasmArray(space, length) { 
    return createWasmArray(space, length, Int8WasmArray); 
}

/**
 * Create a `Uint16WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Uint16WasmArray`.
 */
export function createUint16WasmArray(space, length) { 
    return createWasmArray(space, length, Uint16WasmArray); 
}

/**
 * Create a `Int16WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Int16WasmArray`.
 */
export function createInt16WasmArray(space, length) { 
    return createWasmArray(space, length, Int16WasmArray); 
}

/**
 * Create a `Uint32WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Uint32WasmArray`.
 */
export function createUint32WasmArray(space, length) { 
    return createWasmArray(space, length, Uint32WasmArray); 
}

/**
 * Create a `Int32WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Int32WasmArray`.
 */
export function createInt32WasmArray(space, length) { 
    return createWasmArray(space, length, Int32WasmArray); 
}

/**
 * Create a `Float32WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Float32WasmArray`.
 */
export function createFloat32WasmArray(space, length) { 
    return createWasmArray(space, length, Float32WasmArray); 
}

/**
 * Create a `Float64WasmArray`.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return Instance of a `Float64WasmArray`.
 */
export function createFloat64WasmArray(space, length) { 
    return createWasmArray(space, length, Float64WasmArray); 
}

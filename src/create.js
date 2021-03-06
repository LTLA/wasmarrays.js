import { allocate } from "./globals.js";
import { 
    Int8WasmArray, Uint8WasmArray,
    Int16WasmArray, Uint16WasmArray,
    Int32WasmArray, Uint32WasmArray,
    BigInt64WasmArray, BigUint64WasmArray,
    Float32WasmArray, Float64WasmArray
} from "./derived.js";

/**
 * Create a {@linkplain WasmArray} of the specified subclass.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * @param {class} arrayClass - Desired subclass of the {@linkplain WasmArray}.
 * 
 * @return {WasmArray} Instance of a {@linkplain WasmArray} subclass.
 */
export function createWasmArray(space, length, arrayClass) {
    return allocate(space, length, arrayClass);
}

/**
 * Create a {@linkplain Uint8WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Uint8WasmArray} Instance of a {@linkplain Uint8WasmArray}.
 */
export function createUint8WasmArray(space, length) { 
    return createWasmArray(space, length, Uint8WasmArray); 
}

/**
 * Create a {@linkplain Int8WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Int8WasmArray} Instance of a {@linkplain Int8WasmArray}.
 */
export function createInt8WasmArray(space, length) { 
    return createWasmArray(space, length, Int8WasmArray); 
}

/**
 * Create a {@linkplain Uint16WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Uint16WasmArray} Instance of a {@linkplain Uint16WasmArray}.
 */
export function createUint16WasmArray(space, length) { 
    return createWasmArray(space, length, Uint16WasmArray); 
}

/**
 * Create a {@linkplain Int16WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Int16WasmArray} Instance of a {@linkplain Int16WasmArray}.
 */
export function createInt16WasmArray(space, length) { 
    return createWasmArray(space, length, Int16WasmArray); 
}

/**
 * Create a {@linkplain Uint32WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Uint32WasmArray} Instance of a {@linkplain Uint32WasmArray}.
 */
export function createUint32WasmArray(space, length) { 
    return createWasmArray(space, length, Uint32WasmArray); 
}

/**
 * Create a {@linkplain Int32WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Int32WasmArray} Instance of a {@linkplain Int32WasmArray}.
 */
export function createInt32WasmArray(space, length) { 
    return createWasmArray(space, length, Int32WasmArray); 
}

/**
 * Create a {@linkplain BigUint64WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {BigUint64WasmArray} Instance of a {@linkplain BigUint64WasmArray}.
 */
export function createBigUint64WasmArray(space, length) { 
    return createWasmArray(space, length, BigUint64WasmArray); 
}

/**
 * Create a {@linkplain BigInt64WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {BigInt64WasmArray} Instance of a {@linkplain BigInt64WasmArray}.
 */
export function createBigInt64WasmArray(space, length) { 
    return createWasmArray(space, length, BigInt64WasmArray); 
}

/**
 * Create a {@linkplain Float32WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Float32WasmArray} Instance of a {@linkplain Float32WasmArray}.
 */
export function createFloat32WasmArray(space, length) { 
    return createWasmArray(space, length, Float32WasmArray); 
}

/**
 * Create a {@linkplain Float64WasmArray}.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {number} length - Length of the array to allocate.
 * 
 * @return {Float64WasmArray} Instance of a {@linkplain Float64WasmArray}.
 */
export function createFloat64WasmArray(space, length) { 
    return createWasmArray(space, length, Float64WasmArray); 
}

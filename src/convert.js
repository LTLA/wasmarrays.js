import { allocate } from "./globals.js";
import { safeSet } from "./safeSet.js";
import { 
    Int8WasmArray, Uint8WasmArray,
    Int16WasmArray, Uint16WasmArray,
    Int32WasmArray, Uint32WasmArray,
    BigInt64WasmArray, BigUint64WasmArray,
    Float32WasmArray, Float64WasmArray,
    stringToClass
} from "./derived.js";

/**
 * Convert a (Typed)Array into a new {@linkplain {@linkplain WasmArray} of the specified subclass.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {class} arrayClass - Desired subclass of the {@linkplain WasmArray}.
 * @param {object} [options={}] - Optional parameters to be passed to {@linkcode safeSet}.
 * 
 * @return {WasmArray} Instance of a {@linkplain WasmArray} subclass containing the same contents as `x`.
 *
 * If `arrayClass` is not provided, it defaults to an appropriate type based on `x`.
 * For TypedArray inputs, this is the {@linkplain WasmArray} corresponding to the TypedArray subclass,
 * while for Array inputs, this is the {@linkplain Float64WasmArray} subclass.
 */
export function convertToWasmArray(space, x, arrayClass, { action = "warn", placeholder = 0 } = {}) {
    if (typeof arrayClass === "undefined") {
        if (ArrayBuffer.isView(x)) {
            let input = x.constructor.name;
            try {
                arrayClass = stringToClass(input.replace("Array", "WasmArray"));
            } catch (e) {
                throw new Error("unsupported TypedArray type '" + input + "'");
            }
        } else {
            arrayClass = Float64WasmArray;
        }
    }

    let y;
    try {
        y = allocate(space, x.length, arrayClass);
        safeSet(x, y.array(), { action, placeholder }); // array is safe here, as there's no allocations inside safeSet.
    } catch(e) {
        // Setting might throw weird errors, so we need to 
        // catch and release the memory if the conversion fails.
        if (typeof y !== "undefined") {
            y.free();
        }
        throw e;
    }

    return y;
}

/**
 * Convert a (Typed)Array into a new {@linkplain Uint8WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Uint8WasmArray} Instance of a {@linkplain Uint8WasmArray} subclass containing the same contents as `x`.
 */
export function convertToUint8WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Uint8WasmArray, options);    
}

/**
 * Convert a (Typed)Array into a new {@linkplain Int8WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Int8WasmArray} Instance of a {@linkplain Int8WasmArray} subclass containing the same contents as `x`.
 */
export function convertToInt8WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Int8WasmArray, options);    
}

/**
 * Convert a (Typed)Array into a new {@linkplain Uint16WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Uint16WasmArray} Instance of a {@linkplain Uint16WasmArray} subclass containing the same contents as `x`.
 */
export function convertToUint16WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Uint16WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain Int16WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Int16WasmArray} Instance of a {@linkplain Int16WasmArray} subclass containing the same contents as `x`.
 */
export function convertToInt16WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Int16WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain Uint32WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Uint32WasmArray} Instance of a {@linkplain Uint32WasmArray} subclass containing the same contents as `x`.
 */
export function convertToUint32WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Uint32WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain Int32WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Int32WasmArray} Instance of a {@linkplain Int32WasmArray} subclass containing the same contents as `x`.
 */
export function convertToInt32WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Int32WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain BigUint64WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {BigUint64WasmArray} Instance of a {@linkplain BigUint64WasmArray} subclass containing the same contents as `x`.
 */
export function convertToBigUint64WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, BigUint64WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain BigInt64WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {BigInt64WasmArray} Instance of a {@linkplain BigInt64WasmArray} subclass containing the same contents as `x`.
 */
export function convertToBigInt64WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, BigInt64WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain Float32WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Float32WasmArray} Instance of a {@linkplain Float32WasmArray} subclass containing the same contents as `x`.
 */
export function convertToFloat32WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Float32WasmArray, options);
}

/**
 * Convert a (Typed)Array into a new {@linkplain Float64WasmArray}. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by {@linkcode register}.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {object} [options={}] - Further options, see {@linkcode convertToWasmArray}.
 *
 * @return {Float64WasmArray} Instance of a {@linkplain Float64WasmArray} subclass containing the same contents as `x`.
 */
export function convertToFloat64WasmArray(space, x, options = {}) {
    return convertToWasmArray(space, x, Float64WasmArray, options);
}

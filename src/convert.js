import { allocate } from "./globals.js";
import { 
    Int8WasmArray, Uint8WasmArray,
    Int16WasmArray, Uint16WasmArray,
    Int32WasmArray, Uint32WasmArray,
    Float32WasmArray, Float64WasmArray
} from "./derived.js";

/**
 * Convert a `(Typed)Array` into a new `WasmArray` of the specified subclass.
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 * @param {class} [arrayClass] - Subclass of the `WasmArray` to create.
 * 
 * @return Instance of a `WasmArray` subclass containing the same contents as `x`.
 *
 * If `arrayClass` is not provided, it defaults to an appropriate type based on `x`.
 * For `TypedArray` inputs, this is the `WasmArray` corresponding to the `TypedArray` subclass,
 * while for `Array` inputs, this is the `Float64WasmArray` subclass.
 */
export function convertToWasmArray(space, x, arrayClass) {
    if (typeof arrayClass === "undefined") {
        if (ArrayBuffer.isView(x)) {
            let choices = {
                "Uint8Array": Uint8WasmArray,
                "Int8Array": Int8WasmArray,
                "Uint16Array": Uint16WasmArray,
                "Int16Array": Int16WasmArray,
                "Uint32Array": Uint32WasmArray,
                "Int32Array": Int32WasmArray,
                "Float32Array": Float32WasmArray,
                "Float64Array": Float64WasmArray
            };

            let input = x.constructor.name;
            if (!(input in choices)){ 
                throw "unsupported TypedArray type '" + input + "'";
            }
            arrayClass = choices[input];
        } else {
            arrayClass = Float64WasmArray;
        }
    }

    let y;
    try {
        y = allocate(space, x.length, arrayClass);
        y.set(x);
//        if (ArrayBuffer.isView(x) && (x.constructor.name.startsWith("BigInt") || x.constructor.name.startsWith("BigUint"))) {
//            // Needs an explicit cast from BigInts.
//            var v = y.array();
//            x.forEach((n, i) => { v[i] = Number(n); });
//        } else {
//            y.set(x);
//        }
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
 * Convert a `(Typed)Array` into a new `Uint8WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Uint8WasmArray` subclass containing the same contents as `x`.
 */
export function convertToUint8WasmArray(space, x) {
    return convertToWasmArray(space, x, Uint8WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Int8WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Int8WasmArray` subclass containing the same contents as `x`.
 */
export function convertToInt8WasmArray(space, x) {
    return convertToWasmArray(space, x, Int8WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Uint16WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Uint16WasmArray` subclass containing the same contents as `x`.
 */
export function convertToUint16WasmArray(space, x) {
    return convertToWasmArray(space, x, Uint16WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Int16WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Int16WasmArray` subclass containing the same contents as `x`.
 */
export function convertToInt16WasmArray(space, x) {
    return convertToWasmArray(space, x, Int16WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Uint32WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Uint32WasmArray` subclass containing the same contents as `x`.
 */
export function convertToUint32WasmArray(space, x) {
    return convertToWasmArray(space, x, Uint32WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Int32WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Int32WasmArray` subclass containing the same contents as `x`.
 */
export function convertToInt32WasmArray(space, x) {
    return convertToWasmArray(space, x, Int32WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Float32WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Float32WasmArray` subclass containing the same contents as `x`.
 */
export function convertToFloat32WasmArray(space, x) {
    return convertToWasmArray(space, x, Float32WasmArray);    
}

/**
 * Convert a `(Typed)Array` into a new `Float64WasmArray`. 
 *
 * @param {number} space - Identifier for the Wasm memory space, produced by `register()`.
 * @param {(Array|TypedArray)} x - Array to be converted.
 *
 * @return Instance of a `Float64WasmArray` subclass containing the same contents as `x`.
 */
export function convertToFloat64WasmArray(space, x) {
    return convertToWasmArray(space, x, Float64WasmArray);    
}

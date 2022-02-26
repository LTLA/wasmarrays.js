import { buffer } from "./globals.js";
import { WasmArray } from "./base.js";

/** 
 * Wrapper around an unsigned 8-bit array allocated on the Wasm heap.
 * Users may create instances using the `createUint8WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Uint8WasmArray extends WasmArray {
    /**
     * @return A `Uint8Array` view of the allocated memory.
     */
    array() {
        return new Uint8Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * Name of the class.
     */
    static className = "Uint8WasmArray";
    // We're returning the name explicitly here instead of relying
    // on the constructor.name trick, as the name of the class can
    // change during minification.

    /**
     * Size of the data values.
     */
    static valueSize = 1;
}

/** 
 * Wrapper around a signed 8-bit array allocated on the Wasm heap.
 * Users may create instances using the `createUint8WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Int8WasmArray extends WasmArray {
    /**
     * @return A `Int8Array` view of the allocated memory.
     */
    array() {
        return new Int8Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * Name of the class.
     */
    static className = "Int8WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 1;
}

/** 
 * Wrapper around an unsigned 16-bit array allocated on the Wasm heap.
 * Users may create instances using the `createUint16WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Uint16WasmArray extends WasmArray {
    /**
     * @return A `Uint16Array` view of the allocated memory.
     */
    array() {
        return new Uint16Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * Name of the class.
     */
    static className = "Uint16WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 2;
}

/** 
 * Manage a signed 16-bit array allocated on the Wasm heap.
 * Users may create instances using the `createInt16WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Int16WasmArray extends WasmArray {
    /**
     * @return A `Int16Array` view of the allocated memory.
     */
    array() {
        return new Int16Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * Name of the class.
     */
    static className = "Int16WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 2;
}

/** 
 * Manage an unsigned 32-bit array allocated on the Wasm heap.
 * Users may create instances using the `createUint32WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Uint32WasmArray extends WasmArray {
    /**
     * @return A `Uint32Array` view of the allocated memory.
     */
    array() {
        return new Uint32Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * Name of the class.
     */
    static className = "Uint32WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 4;
}

/** 
 * Manage a signed 32-bit array allocated on the Wasm heap.
 * Users may create instances using the `createInt32WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Int32WasmArray extends WasmArray {
    /**
     * @return A `Int32Array` view of the allocated memory.
     */
    array() {
        return new Int32Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * @return Name of the class.
     */
    static className = "Int32WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 4;
}

/** 
 * Manage a 32-bit float array allocated on the Wasm heap.
 * Users may create instances using the `createFloat32WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Float32WasmArray extends WasmArray {
    /**
     * @return A `Float32Array` view of the allocated memory.
     */
    array() {
        return new Float32Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * @return Name of the class.
     */
    static className = "Float32WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 4;
}

/** 
 * Manage a 64-bit float array allocated on the Wasm heap.
 * Users may create instances using the `createFloat64WasmArray()` function.
 *
 * @augments WasmArray
 */
export class Float64WasmArray extends WasmArray {
    /**
     * @return A `Float64Array` view of the allocated memory.
     */
    array() {
        return new Float64Array(buffer(this.space), this.offset, this.length);
    }

    /**
     * @return Name of the class.
     */
    static className = "Float64WasmArray";

    /**
     * Size of the data values.
     */
    static valueSize = 8;
}

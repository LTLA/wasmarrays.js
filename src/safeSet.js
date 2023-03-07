import { WasmArray } from "./base.js";

function grab_properties(x) {
    let lower_limit = Number.NEGATIVE_INFINITY;
    let upper_limit = Number.POSITIVE_INFINITY;
    let has_special = false;
    let is_array = false;
    let is_bigint = false;

    if (x.constructor == Array) {
        is_array = true;
    } else {
        let bits = null; 
        let signed;

        if (x.constructor.name.startsWith("Uint")) {
            bits = Number(x.constructor.name.replace(/^Uint/, "").replace(/Array$/, ""))
            signed = false;
        } else if (x.constructor.name.startsWith("Int")) {
            bits = Number(x.constructor.name.replace(/^Int/, "").replace(/Array$/, ""))
            signed = true;
        } else if (x.constructor.name.startsWith("Big")) {
            bits = 64;
            signed = x.constructor.name.startsWith("BigInt");
            is_bigint = true;
        }

        if (bits != null) {
            if (!signed) {
                lower_limit = 0;
                upper_limit = 2 ** bits - 1;
            } else {
                lower_limit = - (2 ** (bits - 1));
                upper_limit = 2 ** (bits - 1) - 1;
            }
        } else {
            has_special = true
        }
    }

    return { 
        lower: lower_limit,
        upper: upper_limit,
        bigint: is_bigint,
        special: has_special,
        array: is_array
    };
}

/**
 * Safely set the contents of one array from another, triggering warnings or errors on overflow and other invalid insertions.
 * Note that loss of precision when copying to/from floating-point is considered to be acceptable.
 *
 * @param {Array|TypedArray|WasmArray} from - Array of values to copy from.
 * @param {TypedArray|WasmArray} to - Array of values to copy to.
 * @param {object} [options={}] - Optional parameters.
 * @param {number} [options.offset=0] - Offset in `to` to start copying to.
 * @param {string} [options.action="warn"] - How to handle invalid entries in `from` (that cannot be represented in `to`).
 * This can be one of:
 *
 * - `"none"`: the invalid entry is silently replaced with the `placeholder` value.
 * - `"warn"`: emits a warning on the first invalid entry.
 *   The invalid entry is replaced with the `placeholder` value.
 * - `"error"`: an error is raised upon encountering an invalid entry.
 *
 * @param {number} [options.placeholder=0] - Placeholder value, used to replace invalid entries.
 *
 * @return `to` is filled with the contents of `from`, starting at the specified `offset`.
 */
export function safeSet(from, to, { offset = 0, action = "warn", placeholder = 0 } = {}) {
    if (to.length < from.length + offset) {
        throw new Error("length of 'from' exceeds the length of 'to' at the specified 'offset'");
    }

    if (to.constructor.name == from.constructor.name) {
        to.set(from, offset);
        return;
    }

    let fromprop = grab_properties(from);
    let toprop = grab_properties(to);

    // If permissible, we can directly set the contents of the TypedArray.
    if (fromprop.lower >= toprop.lower && fromprop.upper <= toprop.upper && fromprop.special <= toprop.special && fromprop.bigint == toprop.bigint && !fromprop.array) {
        to.set(from, offset);
        return;
    }

    // Defining the doer function.
    let doer;
    if (action == "none") {
        doer = y => {
            return placeholder;
        };
    } else {
        let msg = "from a " + from.constructor.name + " to a " + to.constructor.name;

        if (action == "warn") {
            let warned = false;
            doer = y => {
                if (!warned) {
                    console.warn("cannot safely insert '" + String(y) + "' " + msg)
                    warned = true;
                }
                return placeholder;
            };
        } else if (action == "error") {
            doer = y => {
                throw new Error("cannot safely insert '" + String(y) + "' " + msg)
            };
        } else {
            throw new Error("unknown action '" + action + "' for handling invalid values");
        }
    }

    let sanitize_number = y => {
        if (fromprop.special && !Number.isFinite(y)) {
            if (!toprop.special) {
                return doer(y);
            }
        } else if (toprop.lower > y || toprop.upper < y) {
            return doer(y);
        }
        return y;
    };

    // BigInts need special handling, as always.
    if (fromprop.bigint && !toprop.bigint) {
        for (var i = 0; i < from.length; i++) {
            let y = Number(from[i]);
            if (toprop.lower > y || toprop.upper < y) {
                y = doer(y);
            }
            to[i + offset] = y;
        }
        return;
    }

    if (toprop.bigint) {
        let lower_limit;
        let upper_limit;
        if (to.constructor == BigUint64Array) {
            lower_limit = 0n;
            upper_limit = 2n ** 64n - 1n;
        } else {
            lower_limit = -(2n ** 63n);
            upper_limit = 2n ** 63n - 1n;
        }

        if (fromprop.bigint) {
            for (var i = 0; i < from.length; i++) {
                let y = from[i];
                if (lower_limit > y || upper_limit < y) {
                    y = BigInt(doer(y));
                }
                to[i + offset] = y;
            }
            return;
        }

        if (fromprop.array) {
            for (var i = 0; i < from.length; i++) {
                let y = from[i];
                if (typeof y == "bigint") {
                    if (lower_limit > y || upper_limit < y) {
                        y = BigInt(doer(y));
                    }
                } else if (typeof y == "number") {
                    y = BigInt(sanitize_number(y));
                } else if (typeof y == "boolean") {
                    y = BigInt(y);
                } else {
                    y = BigInt(doer(y))
                }
                to[i + offset] = y;
            }
            return;
        }

        for (var i = 0; i < from.length; i++) {
            to[i + offset] = BigInt(sanitize_number(from[i]));
        }
        return;
    }

    // Arrays need special handling as well.
    if (fromprop.array) {
        for (var i = 0; i < from.length; i++) {
            let y = from[i];
            if (typeof y === "bigint" || typeof y == "boolean") {
                y = Number(y);
            } else if (typeof y !== "number") {
                y = doer(y);
            }
            to[i + offset] = sanitize_number(y);
        }
        return;
    }

    // Okay, finally, non-bigint typedarray to another non-bigint typedarray.
    for (var i = 0; i < from.length; i++) {
        to[i + offset] = sanitize_number(from[i]);
    }

    return;
}

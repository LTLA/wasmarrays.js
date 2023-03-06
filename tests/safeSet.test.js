import * as wa from "../src/index.js";
import { compareArrays } from "./compare.js";

test("safeSet works correctly for Uint8Array sources", () => {
    let src = new Uint8Array([1,2,3]);

    {
        let dest = new Uint8Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let src2 = new Uint8Array([1,2,255]);
        let dest = new Int8Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: -1 });
        compareArrays([1,2,-1], dest);
    }

    {
        let dest = new Int16Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new Uint32Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new Float64Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new BigInt64Array(3);
        wa.safeSet(src, dest);
        compareArrays([1n, 2n, 3n], dest);
    }
})

test("safeSet works correctly for Float64Array sources", () => {
    let src = new Float64Array([1,2,3]);

    {
        let dest = new Uint8Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let src2 = new Float64Array([1,2,2**32]);
        let dest = new Int32Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: -1 });
        compareArrays([1,2,-1], dest);
    }

    {
        let src2 = new Float64Array([1,2,Number.NaN]);
        let dest = new Int32Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: -1 });
        compareArrays([1,2,-1], dest);
    }

    {
        let dest = new Int16Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new Uint32Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new Float64Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    let impossibles = new Float64Array([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN]);
    {
        let dest = new Float32Array(3);
        wa.safeSet(impossibles, dest);
        expect(dest[0]).toBe(Number.POSITIVE_INFINITY);
        expect(dest[1]).toBe(Number.NEGATIVE_INFINITY);
        expect(Number.isNaN(dest[2])).toBe(true);
    }

    {
        let dest = new BigInt64Array(3);
        wa.safeSet(src, dest);
        compareArrays([1n, 2n, 3n], dest);

        wa.safeSet(impossibles, dest, { action: "none", placeholder: -1 });
        compareArrays([-1n, -1n, -1n], dest);
    }
})

test("safeSet works correctly for BigInt sources", () => {
    let src = new BigInt64Array([1n,2n,3n]);

    {
        let dest = new Uint8Array(3);
        wa.safeSet(src, dest);
        compareArrays([1,2,3], dest);
    }

    {
        let src2 = new BigInt64Array([1n,2n,2n**32n]);
        let dest = new Uint32Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: 999 });
        compareArrays([1,2,999], dest);
    }

    {
        let dest = new Int16Array(3);
        wa.safeSet(src, dest);
        compareArrays([1,2,3], dest);
    }

    {
        let dest = new Uint32Array(3);
        wa.safeSet(src, dest);
        compareArrays([1,2,3], dest);
    }

    {
        let dest = new Float64Array(3);
        wa.safeSet(src, dest);
        compareArrays([1,2,3], dest);
    }

    {
        let dest = new BigInt64Array(3);
        wa.safeSet(src, dest);
        compareArrays([1n, 2n, 3n], dest);
    }

    {
        let dest = new BigUint64Array(3);
        wa.safeSet(src, dest);
        compareArrays([1n, 2n, 3n], dest);
    }

    {
        let src2 = new BigInt64Array([1n,2n,-1000n]);
        let dest = new BigUint64Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: 999 });
        compareArrays([1n,2n,999n], dest);
    }
})

test("safeSet works correctly for Array sources", () => {
    let src = [1,2,3];

    {
        let dest = new Uint8Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let src2 = [1,2,-50];
        let dest = new Uint8Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: 123});
        compareArrays([1,2,123], dest);
    }

    {
        let src2 = [1,2,Number.POSITIVE_INFINITY];
        let dest = new Uint8Array(3);
        expect(() => wa.safeSet(src2, dest, { action: "error" })).toThrow("cannot safely insert");
        wa.safeSet(src2, dest, { action: "none", placeholder: 123});
        compareArrays([1,2,123], dest);
    }

    {
        let src2 = [1,2,3n];
        let dest = new Uint8Array(3);
        wa.safeSet(src2, dest);
        compareArrays([1,2,3], dest);
    }

    {
        let dest = new Uint16Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new Int32Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new Float64Array(3);
        wa.safeSet(src, dest);
        compareArrays(src, dest);
    }

    {
        let dest = new BigUint64Array(3);
        wa.safeSet(src, dest);
        compareArrays([1n, 2n, 3n], dest);
    }

    let variety = [1, 2, null, "foo", Number.NEGATIVE_INFINITY];
    {
        let dest = new Float64Array(5);
        wa.safeSet(variety, dest, { action: "none", placeholder: -1 });
        compareArrays([1, 2, -1, -1, Number.NEGATIVE_INFINITY], dest);
    }

    {
        let dest = new BigUint64Array(5);
        wa.safeSet(variety, dest, { action: "none", placeholder: 99 });
        compareArrays([1n, 2n, 99n, 99n, 99n], dest);
    }
})


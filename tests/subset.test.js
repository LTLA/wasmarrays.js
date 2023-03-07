import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";
import { compareArrays } from "./compare.js";

test("array subsetting works", () => {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let x = wa.createInt32WasmArray(space, 6);
    x.set([0,1,2,0,1,2]);

    {
        let filtered = wa.subsetWasmArray(x, [0, 2, 4]);
        compareArrays(filtered.array(), [0,2,1]);
        filtered.free();
    }

    {
        // Preserves order.
        let filtered = wa.subsetWasmArray(x, [5, 3, 1]);
        compareArrays(filtered.array(), [2,0,1]);
        filtered.free();
    }

    {
        // Works with a buffer.
        let buffer = wa.createInt32WasmArray(space, 6);
        let filtered = wa.subsetWasmArray(x, [0,2,4,5,3,1], { buffer: buffer });
        compareArrays(filtered.array(), [0,2,1,2,0,1]);
        buffer.free();
    }

    {
        let filtered = wa.subsetWasmArray(x, [0, 1, 0, 0, 0, 1], { filter: true });
        compareArrays(filtered.array(), [0, 2, 0, 1]);
        filtered.free();

        // Inverting the filter.
        filtered = wa.subsetWasmArray(x, [0, 1, 0, 0, 0, 1], { filter: false });
        compareArrays(filtered.array(), [1, 2]);
        filtered.free();
    }

    // Errors hit correctly.
    {
        expect(() => wa.subsetWasmArray(x, [], { filter: true })).toThrow("should have the same length");
        expect(() => wa.subsetWasmArray(x, [10000])).toThrow("out-of-range");
    }
})

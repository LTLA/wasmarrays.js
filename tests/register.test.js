// This tests the registration of Wasm modules.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";

test("registration of memory spaces work as expected", () => {
    let mocked = mockWasmHeap();

    let out = wa.register(mocked);
    expect(out).toBe(0);

    let again = wa.register(mocked);
    expect(again).toBe(1);
});

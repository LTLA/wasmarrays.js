// This tests the creation of WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";

function creation_test_suite(creator, expectedClass, expectedSize) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    // First creation works.
    let x = creator(space, 10);
    expect(x.constructor.className).toBe(expectedClass);
    expect(x.offset).toBe(0);
    expect(x.length).toBe(10);
    expect(mocked.used).toBe(expectedSize * 10);

    // Second creation works.
    let y = creator(space, 20);
    expect(y.constructor.className).toBe(expectedClass);
    expect(y.offset).toBe(expectedSize * 10);
    expect(y.length).toBe(20);
    expect(mocked.used).toBe(expectedSize * 30);

    // Creation in another space works.
    let mocked2 = mockWasmHeap();
    let space2 = wa.register(mocked2);

    let z = creator(space2, 25);
    expect(z.constructor.className).toBe(expectedClass);
    expect(z.offset).toBe(0);
    expect(z.length).toBe(25);
    expect(mocked2.used).toBe(expectedSize * 25);

    expect(mocked.used).toBe(expectedSize * 30); // unchanged, it's a different memory space.

    // Freeing stuff.
    expect(mocked.freed.length).toBe(0);

    x.free();
    expect(x.offset).toBe(null);
    expect(mocked.freed.length).toBe(1);
    expect(mocked.freed[0]).toBe(0);

    let prevy = y.offset;
    y.free();
    expect(mocked.freed.length).toBe(2);
    expect(mocked.freed[1]).toBe(prevy);
}

test("Uint8WasmArrays can be created", () => {
    creation_test_suite(wa.createUint8WasmArray, "Uint8WasmArray", 1);
});

test("Int8WasmArrays can be created", () => {
    creation_test_suite(wa.createInt8WasmArray, "Int8WasmArray", 1);
});

test("Uint16WasmArrays can be created", () => {
    creation_test_suite(wa.createUint16WasmArray, "Uint16WasmArray", 2);
});

test("Int16WasmArrays can be created", () => {
    creation_test_suite(wa.createInt16WasmArray, "Int16WasmArray", 2);
});

test("Uint32WasmArrays can be created", () => {
    creation_test_suite(wa.createUint32WasmArray, "Uint32WasmArray", 4);
});

test("Int32WasmArrays can be created", () => {
    creation_test_suite(wa.createInt32WasmArray, "Int32WasmArray", 4);
});

test("Float32WasmArrays can be created", () => {
    creation_test_suite(wa.createFloat32WasmArray, "Float32WasmArray", 4);
});

test("Float64WasmArrays can be created", () => {
    creation_test_suite(wa.createFloat64WasmArray, "Float64WasmArray", 8);
});

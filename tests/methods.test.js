// This tests the creation of WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";
import { compareArrays } from "./compare.js";
import { biggify } from "./biggify.js";

function methods_test_suite(creator, expectedClass, big = false) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let x = creator(space, 10);

    // Fetching a view.
    let y = x.array();
    expect(y.length).toBe(10);
    expect(y.constructor.name).toBe(expectedClass);
    expect(y.buffer === mocked.HEAP8.buffer).toBe(true);

    // Setting.
    let values = [];
    for (var i = 0; i < x.length; i++) {
        let val = Math.random() * 100;
        val = Math.round(val);
        values.push(biggify(val, big));
    }
    x.set(values);
    compareArrays(values, x.array());

    // Slicing.
    let z = x.slice();
    expect(z.constructor.name).toBe(expectedClass);
    compareArrays(values, x.slice());
    expect(z.buffer !== mocked.HEAP8.buffer).toBe(true);
    compareArrays(values.slice(5), x.slice(5));
    compareArrays(values.slice(2, 8), x.slice(2, 8));

    // More setting.
    let counter = [];
    for (var i = 0; i < 4; ++i) {
        counter.push(biggify(i, big));
    }

    let shift = 3;
    for (var i = 0; i < counter.length; i++) {
        values[i + shift] = counter[i];
    }

    x.set(counter, 3);
    compareArrays(values, x.array());

    // Filling.
    let zero = biggify(0, big);
    x.fill(zero);
    let aa = x.array();
    for (var i = 0; i < x.length; i++) {
        expect(aa[i]).toBe(zero);
    }

    // Creating a clone.
    x.set(values);
    let x2 = x.clone();
    expect(x2.length).toBe(x.length);
    expect(x2.offset != x.offset).toBe(true);

    let z2 = x2.array();
    compareArrays(z2, x.array());
    expect(x2.array().constructor.name).toBe(expectedClass);
}

test("Uint8WasmArray methods work correctly", () => {
    methods_test_suite(wa.createUint8WasmArray, "Uint8Array");
});

test("Int8WasmArray methods work correctly", () => {
    methods_test_suite(wa.createInt8WasmArray, "Int8Array");
});

test("Uint16WasmArray methods work correctly", () => {
    methods_test_suite(wa.createUint16WasmArray, "Uint16Array");
});

test("Int16WasmArray methods work correctly", () => {
    methods_test_suite(wa.createInt16WasmArray, "Int16Array");
});

test("Uint32WasmArray methods work correctly", () => {
    methods_test_suite(wa.createUint32WasmArray, "Uint32Array");
});

test("Int32WasmArray methods work correctly", () => {
    methods_test_suite(wa.createInt32WasmArray, "Int32Array");
});

test("BigUint64WasmArray methods work correctly", () => {
    methods_test_suite(wa.createBigUint64WasmArray, "BigUint64Array", true);
});

test("BigInt64WasmArray methods work correctly", () => {
    methods_test_suite(wa.createBigInt64WasmArray, "BigInt64Array", true);
});

test("Float32WasmArray methods work correctly", () => {
    methods_test_suite(wa.createFloat32WasmArray, "Float32Array");
});

test("Float64WasmArray methods work correctly", () => {
    methods_test_suite(wa.createFloat64WasmArray, "Float64Array");
});

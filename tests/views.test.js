// This tests the view creation on WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";
import { biggify } from "./biggify.js";

function view_method_test_suite(creator, expectedClass, big = false) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let x = creator(space, 10);
    expect(x.constructor.className).toBe(expectedClass);

    let y = x.array();
    for (var i = 0; i < y.length; i++) {
        let val = Math.round(Math.random() * 100);
        y[i] = biggify(val, big);
    }

    // Creating a view.
    let start = 3;
    let end = 6;
    let v = x.view(start, end);
    expect(v.constructor.className).toBe(x.constructor.className);
    expect(v.length).toBe(end - start);

    let w = v.array();
    for (var i = 0; i < w.length; i++) {
        expect(w[i]).toBe(y[i + start]);
    }

    let v2 = x.view();
    expect(v2.length).toBe(x.length);

    // Checking owners.
    expect(x.owner).toBe(null);
    expect(x.id >= 0).toBe(true);
    expect(v.owner == x).toBe(true);
    expect(v.id).toBe(-1);

    let extra = 1;
    let subv = v.view(extra, 3);
    expect(subv.owner == x).toBe(true);

    let subw = subv.array();
    for (var i = 0; i < subw.length; i++) {
        expect(subw[i]).toBe(y[i + start + extra]);
    }

    // Deletion of the view is a no-op.
    v.free();
    expect(mocked.freed.length).toBe(0);
}

function view_create_test_suite(creator, expectedClass, big = false) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let x = creator(space, 20, 80); // needs to be a multiple of 8 for Floats.
    expect(x.constructor.className).toBe(expectedClass);
    expect(x.length).toBe(20);
    expect(x.offset).toBe(80);

    // No allocation is created, it's just a view.
    expect(x.id).toBe(-1);
    expect(mocked.used).toBe(0);
    expect(JSON.stringify(x.owner)).toBe("{}");

    // It can be filled with no problem.
    let y = x.array();
    for (var i = 0; i < y.length; i++) {
        let val = Math.round(Math.random() * 100);
        y[i] = biggify(val, big);
    }

    // Deletion of the view is a no-op.
    x.free();
    expect(mocked.freed.length).toBe(0);
}

test("Uint8WasmArray views can be created", () => {
    view_method_test_suite(wa.createUint8WasmArray, "Uint8WasmArray");
    view_create_test_suite(wa.createUint8WasmArrayView, "Uint8WasmArray");
});

test("Int8WasmArray views can be created", () => {
    view_method_test_suite(wa.createInt8WasmArray, "Int8WasmArray");
    view_create_test_suite(wa.createInt8WasmArrayView, "Int8WasmArray");
});

test("Uint16WasmArray views can be created", () => {
    view_method_test_suite(wa.createUint16WasmArray, "Uint16WasmArray");
    view_create_test_suite(wa.createUint16WasmArrayView, "Uint16WasmArray");
});

test("Int16WasmArray views can be created", () => {
    view_method_test_suite(wa.createInt16WasmArray, "Int16WasmArray");
    view_create_test_suite(wa.createInt16WasmArrayView, "Int16WasmArray");
});

test("Uint32WasmArray views can be created", () => {
    view_method_test_suite(wa.createUint32WasmArray, "Uint32WasmArray");
    view_create_test_suite(wa.createUint32WasmArrayView, "Uint32WasmArray");
});

test("Int32WasmArray views can be created", () => {
    view_method_test_suite(wa.createInt32WasmArray, "Int32WasmArray");
    view_create_test_suite(wa.createInt32WasmArrayView, "Int32WasmArray");
});

test("BigUint64WasmArray views can be created", () => {
    view_method_test_suite(wa.createBigUint64WasmArray, "BigUint64WasmArray", true);
    view_create_test_suite(wa.createBigUint64WasmArrayView, "BigUint64WasmArray", true);
});

test("BigInt64WasmArray views can be created", () => {
    view_method_test_suite(wa.createBigInt64WasmArray, "BigInt64WasmArray", true);
    view_create_test_suite(wa.createBigInt64WasmArrayView, "BigInt64WasmArray", true);
});

test("Float32WasmArray views can be created", () => {
    view_method_test_suite(wa.createFloat32WasmArray, "Float32WasmArray");
    view_create_test_suite(wa.createFloat32WasmArrayView, "Float32WasmArray");
});

test("Float64WasmArray views can be created", () => {
    view_method_test_suite(wa.createFloat64WasmArray, "Float64WasmArray");
    view_create_test_suite(wa.createFloat64WasmArrayView, "Float64WasmArray");
});

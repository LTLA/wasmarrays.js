// This tests the view creation on WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";

function view_test_suite(creator) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let x = creator(space, 10);
    let y = x.array();
    for (var i = 0; i < y.length; i++) {
        y[i] = Math.random() * 100;
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
    expect(v.owner == x).toBe(true);

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

test("Uint8WasmArray views can be created", () => {
    view_test_suite(wa.createUint8WasmArray, "Uint8WasmArray");
});

test("Int8WasmArray views can be created", () => {
    view_test_suite(wa.createInt8WasmArray, "Int8WasmArray");
});

test("Uint16WasmArray views can be created", () => {
    view_test_suite(wa.createUint16WasmArray, "Uint16WasmArray");
});

test("Int16WasmArray views can be created", () => {
    view_test_suite(wa.createInt16WasmArray, "Int16WasmArray");
});

test("Uint32WasmArray views can be created", () => {
    view_test_suite(wa.createUint32WasmArray, "Uint32WasmArray");
});

test("Int32WasmArray views can be created", () => {
    view_test_suite(wa.createInt32WasmArray, "Int32WasmArray");
});

test("Float32WasmArray views can be created", () => {
    view_test_suite(wa.createFloat32WasmArray, "Float32WasmArray");
});

test("Float64WasmArray views can be created", () => {
    view_test_suite(wa.createFloat64WasmArray, "Float64WasmArray");
});

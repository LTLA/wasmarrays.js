// This tests the array mimicking abilities of WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";
import { biggify } from "./biggify.js";
import { compareArrays } from "./compare.js";

function arrays_test_suite(creator, big) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let x = creator(space, 10);

    let y = x.array();
    for (var i = 0; i < y.length; i++) {
        y[i] = biggify(Math.round(Math.random() * 100), big);
    }
    
    // Checking the iteration methods.
    let gathered = [];
    for (const z of x) {
        gathered.push(z);                        
    }
    compareArrays(gathered, y);
    
    gathered = [];
    for (const z of x.values()) {
        gathered.push(z);
    }
    compareArrays(gathered, y);

    gathered = [];
    for (const z of x.keys()) {
        gathered.push(z);
    }
    expect(gathered[0]).toBe(0);
    expect(gathered.length).toBe(x.length);
    expect(gathered[gathered.length-1]).toBe(x.length - 1);

    // Checking the loop syntactical sugar:
    let p1 = (x) => x + biggify(1, big);
    compareArrays(x.map(p1), y.map(p1));

    let g50 = (x) => x > biggify(50, big);
    compareArrays(x.filter(g50), y.filter(g50));

    let contents = new Array(x.length);
    x.forEach((v, i) => {
        contents[i] = v;
    });
    compareArrays(contents, y);
}

test("Uint8WasmArray views can be created", () => {
    arrays_test_suite(wa.createUint8WasmArray);
});

test("Int8WasmArray views can be created", () => {
    arrays_test_suite(wa.createInt8WasmArray);
});

test("Uint16WasmArray views can be created", () => {
    arrays_test_suite(wa.createUint16WasmArray);
});

test("Int16WasmArray views can be created", () => {
    arrays_test_suite(wa.createInt16WasmArray);
});

test("Uint32WasmArray views can be created", () => {
    arrays_test_suite(wa.createUint32WasmArray);
});

test("Int32WasmArray views can be created", () => {
    arrays_test_suite(wa.createInt32WasmArray);
});

test("BigUint64WasmArray views can be created", () => {
    arrays_test_suite(wa.createBigUint64WasmArray, true);
});

test("BigInt64WasmArray views can be created", () => {
    arrays_test_suite(wa.createBigInt64WasmArray, true);
});

test("Float32WasmArray views can be created", () => {
    arrays_test_suite(wa.createFloat32WasmArray);
});

test("Float64WasmArray views can be created", () => {
    arrays_test_suite(wa.createFloat64WasmArray);
});

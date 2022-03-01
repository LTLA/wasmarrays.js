// This tests the conversion of WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";
import { compareArrays } from "./compare.js";
import { biggify } from "./biggify.js";

function conversion_test_suite(converter, expectedClass, big = false) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    let values = [];
    for (var i = 1; i <= 8; i++) {
        values.push(biggify(i, big));
    }

    // Conversion from arrays work.
    let con = converter(space, values);
    expect(con.constructor.className).toBe(expectedClass);
    expect(con.length).toBe(values.length);
    compareArrays(con.array(), values);

    // Conversion from TypedArrays work.
    let arr = con.slice();
    let con2 = converter(space, arr);
    compareArrays(con2.array(), values);

    // Also works properly if class is not specified.
    let con3 = wa.convertToWasmArray(space, arr);
    expect(con3.constructor.className).toBe(expectedClass);
    compareArrays(con3.array(), values);

    if (!big) {
        let con4 = wa.convertToWasmArray(space, values);
        expect(con4.constructor.className).toBe("Float64WasmArray");
        con4.free();
    }

    // Freeing stuff.
    con.free();
    con2.free();
    con3.free();
}

test("Uint8WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToUint8WasmArray, "Uint8WasmArray");
});

test("Int8WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToInt8WasmArray, "Int8WasmArray");
});

test("Uint16WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToUint16WasmArray, "Uint16WasmArray");
});

test("Int16WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToInt16WasmArray, "Int16WasmArray");
});

test("Uint32WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToUint32WasmArray, "Uint32WasmArray");
});

test("Int32WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToInt32WasmArray, "Int32WasmArray");
});

test("BigUint64WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToBigUint64WasmArray, "BigUint64WasmArray", true);
});

test("BigInt64WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToBigInt64WasmArray, "BigInt64WasmArray", true);
});

test("Float32WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToFloat32WasmArray, "Float32WasmArray");
});

test("Float64WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToFloat64WasmArray, "Float64WasmArray");
});

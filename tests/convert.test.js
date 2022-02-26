// This tests the conversion of WasmArrays.
import * as wa from "../src/index.js";
import { mockWasmHeap } from "./mock.js";
import { compareArrays } from "./compare.js";

function conversion_test_suite(converter, expectedClass) {
    let mocked = mockWasmHeap();
    let space = wa.register(mocked);

    // Conversion from arrays work.
    let values = [1,2,3,4,5,6,7,8];

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

    let con4 = wa.convertToWasmArray(space, values);
    expect(con4.constructor.className).toBe("Float64WasmArray");

    // Freeing stuff.
    con.free();
    con2.free();
    con3.free();
    con4.free();
}

test("Uint8WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToUint8WasmArray, "Uint8WasmArray", 1);
});

test("Int8WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToInt8WasmArray, "Int8WasmArray", 1);
});

test("Uint16WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToUint16WasmArray, "Uint16WasmArray", 2);
});

test("Int16WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToInt16WasmArray, "Int16WasmArray", 2);
});

test("Uint32WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToUint32WasmArray, "Uint32WasmArray", 4);
});

test("Int32WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToInt32WasmArray, "Int32WasmArray", 4);
});

test("Float32WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToFloat32WasmArray, "Float32WasmArray", 4);
});

test("Float64WasmArrays can be converted", () => {
    conversion_test_suite(wa.convertToFloat64WasmArray, "Float64WasmArray", 8);
});

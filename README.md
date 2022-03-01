# Helper classes for WebAssembly arrays

## Overview

WebAssembly uses a resizeable `(Shared)ArrayBuffer` as its heap memory store.
Developers can allocate arrays on this heap to pass data efficiently between Javascript and WebAssembly code.
The `WasmArray` class wraps these arrays for more convenient use in complex web applications.
We provide functions to quickly create new allocations and convert existing `(Typed)Array`s into their corresponding `WasmArray`s.
We provide some helper methods to produce a `TypedArray` view from a `WasmArray` and manipulate its contents.
We implement finalizers that automatically free the heap allocation when instances of the class are garbage-collected by the Javascript engine.
Users may also directly free the memory for greater control.

## Quick start

Install the package as usual from NPM:

```sh
npm i wasmarrays.js
```

This is written as an ES6 module, so we can import its methods and classes:

```js
import * as wa from "wasmarrays.js";
```

We assume that the application already has a Wasm `module` object, typically produced by Emscripten.
We register our Wasm module with the **WasmArray** package:

```js
let space = wa.register(module);
```

Then we can create `WasmArray`s on that Wasm heap, e.g., a 1000-element array of unsigned 8-bit integers:

```js
let my_array = wa.createUint8WasmArray(space, 1000);
```

Check out the [API documentation](https://ltla.github.io/wasmarrays.js) for more details.

## Mimicking `TypedArray`s

We can create a `TypedArray` view of a `WasmArray` by calling:

```js
my_array.array(); // Uint8Array view of the allocation
```

This view can be used to write or read values from the Wasm heap.
However, some caution is required as it seems that views can be invalidated when the heap is resized.
We generally recommend only creating a view immediately before its use, i.e., there should be no Wasm allocations after the creation of a view but before its use.

For greater robustness to resizing, we provide some methods for the `WasmArray` to mimic its `TypedArray` view.
This avoids exposing the creation of a view in the caller's code, avoiding any problems with intervening allocations. 
Note that `slice()` methods return a `TypedArray` with its own `ArrayBuffer` that is not susceptible to issues with Wasm heap resizing.

```js
my_array.length; // 1000

my_array.slice(); // new Uint8Array copy of the entire array
my_array.slice(500); // new Uint8Array copy from [500, 1000)
my_array.slice(500, 600); // new Uint8Array copy from [500, 600)

my_array.fill(0); // fills the allocation with zero's.
my_array.fill(1, 200); // fills [200, 1000) with 1's.
my_array.fill(2, 300, 500); // fills [300m 500) with 2's.

values = [1,2,3,4,5];
my_array.set(values); // fills first five values with 1->5.
my_array.set(values, 101); // fills 101->105 with 1->5.
```

## Interacting with the heap

For an instance of a `WasmArray`, the offset of the allocation on its Wasm heap is available in the `offset` property.
This can be passed to Wasm functions for efficient access to the array data.

Multiple Wasm heaps may be registered via `register` if there are multiple Wasm-enabled applications that need to use `WasmArray`s.
Currently, each Wasm module can only use the memory from its own heap.
Applications can check whether a `WasmArray` instance refers to an allocation on the appropriate heap by comparing the `space` property with the value returned by `register()`.
If it is, the instance's `offset` can be used directly. 
Otherwise, an application can make a copy on their own heap:

```js
let copy = my_array.clone(new_space);
```

Advanced users may also create `WasmArray`s that are views on other `WasmArray`s.
This avoids the need to carry around start/end parameters when only a subset of the data is of interest.

```js
let view = my_array.view(20, 50);
```

We can also create a view directly on the Wasm heap.
This is helpful for wrapping allocations that are owned by other objects (e.g., instances of `embind`-ed C++ classes).

```js
let view2 = wa.createUint8WasmArrayView(my_array.space, my_array.length, my_array.offset);
```

## Lifetime management

For each `WasmArray` instance created with the `create*WasmArray()` functions, 
we register a [finalizer callback](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry) when the instance is garbage-collected.
This frees its corresponding allocation on the Wasm heap to reduce memory usage in long-running applications.
Thus, most users can operate on `WasmArray` instances without worrying about manual memory management.

That said, advanced users may prefer to manually free the memory when it is no longer needed.
Finalizer callbacks may not be run in a predictable manner, so if memory is scarce, direct control is required to guarantee that the memory is released.
To achieve this, we can do:

```js
my_array.free();
```

## Contact

This package is maintained by Aaron Lun ([@LTLA](https://github.com/LTLA)).
Post feature requests and bug reports on the [GitHub Issues page](https://github.com/LTLA/wasmarrays.js/issues).

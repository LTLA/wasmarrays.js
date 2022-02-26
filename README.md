# WasmArray.js

The `WasmArray` class wraps an array allocated on the WebAssembly heap.
(Specifically, for the Wasm modules created by Emscripten.)
It provides some methods to mimic the behavior of the corresponding `TypedArray`, e.g., `set`, `slice`.
It also implements transparent lifetime management where the Wasm allocation is freed when the class is garbage-collected in Javascript.
Users may also directly free the memory for greater control.

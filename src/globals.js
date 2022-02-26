const memories = {};

export function release(space, id) {
    if (space in memories) {
        let cur_memory = memories[space];
        let cur_live = cur_memory.live;
        if (id in cur_live) {
            let cur_module = cur_memory.module;
            cur_module._free(cur_live[id]);
            delete cur_live[id];
        }
    }
}

export function allocate(space, length, arrayClass) {
    let current = memories[space];

    let curmod = current.module;
    let curlive = current.live;

    let offset = curmod._malloc(arrayClass.valueSize * length);
    curlive[current.ids] = offset;
    let x = new arrayClass(space, current.ids, length, offset, true);

    finalizer.register(x, { space: space, id: current.ids });
    return x
}

export function buffer(space) {
    let curmod = memories[space].module;
    return curmod.wasmMemory.buffer;
}

const finalizer = new FinalizationRegistry(held => {
    release(held.space, held.id);
});

var spaces = 0;

/**
 * Register a Wasm module for creation of `WasmArray`s.
 *
 * @param {object} module - A Wasm module object, usually produced by Emscripten.
 *
 * @return Integer containing the identifier for this module's memory space.
 */
export function register(module) {
    let space = spaces;
    memories[space] = {
        module: module, 
        live: {}, 
        ids: 0
    };
    spaces += 1;
    return space;
}

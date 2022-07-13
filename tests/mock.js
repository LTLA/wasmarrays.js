// Mocking up a Wasm heap.
export function mockWasmHeap() {
    let stuff = {
        HEAP8: {
            buffer: new ArrayBuffer(1000),
        },
        used: 0,
        freed: []
    };

    stuff._malloc = (n) => {
        let position = stuff.used;
        let needed = stuff.used + n;

        if (needed > stuff.HEAP8.buffer.byteLength) {
            throw "this is just a dummy, stupid!"
        }

        stuff.used = needed;
        return position;
    },

    stuff._free = (offset) => {
        // No real freeing; it's just a dummy!
        stuff.freed.push(offset);
    }

    return stuff;
}

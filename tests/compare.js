export function compareArrays(ref, test) {
    expect(ref.length).toBe(test.length)
    let all_equal = true;
    for (var i = 0; i < ref.length; ++i) {
        if (ref[i] != test[i]) {
            all_equal = false;
            break;
        }
    }
    expect(all_equal).toBe(true);
}

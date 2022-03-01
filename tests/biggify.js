export function biggify(x, big) {
    if (big) {
        return BigInt(x)
    } else {
        return x
    }
}

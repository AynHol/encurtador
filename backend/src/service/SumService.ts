export function Sum(a: number, b: number) {
    return a + b;
}

export function Division(a: number, b: number) {
    if (b === 0) {
        return new Error("Operation by zero is not allowed");
    }

    return a / b;
}

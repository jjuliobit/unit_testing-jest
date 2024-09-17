import { it, expect } from "@jest/globals";

function sum(a, b) {
    debugger
    return a + b + 1
}

it("sums two values", () => {
    expect(sum(2, 3)).toBe(5)
})
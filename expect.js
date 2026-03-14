globalThis.expect = (received) => {
    return {
        toBe: (expected) => {
            if (received === expected) return;
            const err = new Error();
            const path = err.stack
                .split("\n").filter(p => p.trim() !== "").at(-1);
            const line = path.split(":").at(-2);
            const msg = `Test failed on line ${line}: `
                + `expected ${formatValue(expected)}, `
                + `but received ${formatValue(received)}.`;
            err.message = msg;
            console.error(msg);
        },
    };
};

/**
 * Formats the given value for output.
 * @param {any} value
 * @returns {string}
 */
function formatValue(value) {
    switch (typeof value) {
        case "number":
            return `the number ${value}`;
        case "string":
            return `the string "${value}"`;
        default:
            return String(value);
    }
}

// Tests for expect().toBe
expect(1 + 1).toBe(2);
expect("hello").toBe("hello");
expect(true).toBe(true);

// Tests for formatValue
expect(formatValue(42)).toBe("the number 42");
expect(formatValue("hi")).toBe(`the string "hi"`);
expect(formatValue(true)).toBe("true");

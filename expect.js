(() => {
    /**
     * Creates an assertion object for the given expected value.
     * @param {any} received
     * @returns {{ toBe: (expected: any) => void, toEqual: (expected: any) => void }}
     */
    globalThis.expect = function expect(received) {
        return {
            toBe: (expected) => {
                if (received !== expected) fail(expected, received);
            },
            toEqual: (expected) => {
                if (!deepEqual(received, expected)) fail(expected, received);
            },
        };
    };

    expect(1 + 1).toBe(2);
    expect("hello").toBe("hello");
    expect(true).toBe(true);

    /**
     * Reports a test failure with the line number, expected, and received values.
     * @param {any} expected
     * @param {any} received
     */
    function fail(expected, received) {
        const err = new Error();
        const path = err.stack
            .split("\n").filter(p => p.trim() !== "").at(-1);
        const line = path.split(":").at(-2);
        const msg = `Test failed on line ${line}: `
            + `expected ${formatValue(expected)}, `
            + `but received ${formatValue(received)}.`;
        console.error(msg);

        const notInBrowser = typeof document === "undefined";
        if (notInBrowser) process.exitCode = 1;
    }

    /**
     * Recursively checks deep equality between two values.
     * @param {any} a
     * @param {any} b
     * @returns {boolean}
     */
    function deepEqual(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return false;
        if (typeof a !== typeof b) return false;
        if (typeof a !== "object") return false;
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;

        return keysA.every(key => deepEqual(a[key], b[key]));
    }

    expect({ a: 1 }).toEqual({ a: 1 });
    expect({ a: 1, b: { c: 2 } }).toEqual({ a: 1, b: { c: 2 } });
    expect([1, 2, 3]).toEqual([1, 2, 3]);
    expect(new Date("2024-01-01")).toEqual(new Date("2024-01-01"));

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
            case "object":
                if (value === null) return "null";
                if (value instanceof Date) {
                    return `the Date object for ${value.toLocaleString()}`;
                }
                if (Array.isArray(value)) {
                    return `the array ${JSON.stringify(value)}`;
                }
                return `the object ${JSON.stringify(value)}`;
            default:
                return String(value);
        }
    }

    expect(formatValue(42)).toBe("the number 42");
    expect(formatValue("hi")).toBe("the string \"hi\"");
    expect(formatValue(true)).toBe("true");
    expect(formatValue(null)).toBe("null");
    expect(formatValue(new Date("2024-01-01T00:00:00"))).toBe(
        `the Date object for ${
            new Date("2024-01-01T00:00:00").toLocaleString()
        }`,
    );
    expect(formatValue({ a: 1 })).toBe("the object {\"a\":1}");
    expect(formatValue([1, 2])).toBe("the array [1,2]");
})();

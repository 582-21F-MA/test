(() => {
    /**
     * Runs a named test containing one or more expects.
     * @param {string} description
     * @param {() => void} fn
     */
    globalThis.test = function(_description, fn) {
        fn();
    };

    /**
     * Creates an assertion object for the given expected value.
     * @param {any} received
     * @returns {{ toBe: (expected: any) => void, toEqual: (expected: any) => void }}
     */
    globalThis.expect = function(received) {
        return {
            toBe: (expected) => {
                if (received !== expected) failCompare(expected, received);
            },
            toEqual: (expected) => {
                if (!deepEqual(received, expected)) {
                    failCompare(expected, received);
                }
            },
            toContain: (item) => {
                if (typeof received !== "string" && !Array.isArray(received)) {
                    throw new Error(
                        "the argument passed to expect must be a string or an array",
                    );
                }
                if (!received.includes(item)) failContain(item, received);
            },
        };
    };

    /**
     * Logs a failure message and sets the exit code outside the browser.
     * @param {string} msg
     */
    function reportFailure(msg) {
        console.error(msg);
        if (typeof document === "undefined") process.exitCode = 1;
    }

    /**
     * Returns the source line number of the outermost call in the stack.
     * @returns {string}
     */
    function getFailLine() {
        const err = new Error();
        const path = err.stack
            .split("\n").filter(p => p.trim() !== "").at(-1);
        return path.split(":").at(-2);
    }

    /**
     * Reports a comparison test failure.
     * @param {any} expected
     * @param {any} received
     */
    function failCompare(expected, received) {
        const line = getFailLine();
        reportFailure(
            `Test failed on line ${line}: `
                + `expected ${_formatValue(expected)}, `
                + `but received ${_formatValue(received)}.`,
        );
    }

    /**
     * Reports a contain test failure.
     * @param {any} item
     * @param {any} received
     */
    function failContain(item, received) {
        const line = getFailLine();
        reportFailure(
            `Test failed on line ${line}: `
                + `expected ${_formatValue(received)} `
                + `to contain ${_formatValue(item)}.`,
        );
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
        if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) return false;
            for (const [key, val] of a) {
                if (!b.has(key)) return false;
                if (!deepEqual(val, b.get(key))) return false;
            }
            return true;
        }
        if (a instanceof Map !== b instanceof Map) return false;

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;

        return keysA.every(key => deepEqual(a[key], b[key]));
    }

    /**
     * Formats the given value for output.
     * @param {any} value
     * @returns {string}
     */
    globalThis._formatValue = function(value) {
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
                if (value instanceof Map) {
                    const entries = [...value].map(([k, v]) =>
                        `${JSON.stringify(k)} => ${JSON.stringify(v)}`
                    ).join(", ");
                    return `the Map {${entries}}`;
                }
                return `the object ${JSON.stringify(value)}`;
            default:
                return String(value);
        }
    };
})();

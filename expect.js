(() => {
    /**
     * Creates an assertion object for the given expected value.
     * @param {any} received
     * @returns {{ toBe: (expected: any) => void }}
     */
    globalThis.expect = function expect(received) {
        return {
            toBe: (expected) => {
                const testPasses = received === expected;
                if (testPasses) return;

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
            },
        };
    };

    expect(1 + 1).toBe(2);
    expect("hello").toBe("hello");
    expect(true).toBe(true);

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

    expect(formatValue(42)).toBe("the number 42");
    expect(formatValue("hi")).toBe("the string \"hi\"");
    expect(formatValue(true)).toBe("true");
})();

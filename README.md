# Expect

Script that adds an `expect` function (similar to Jest) to the global
scope. It can be used to add inline unit tests to scripts.

When used in the browser, this script must be placed before all other
scripts:

```html
<script src="https://582-21f-ma.github.io/test/expect.js"></script>
<script src="index.js"></script>
```

When used in a runtime (Node, Bun, etc.), this script must be
concatenated with scripts that use `expect`:

```sh
{ curl https://582-21f-ma.github.io/test/expect.js; cat index.js; } | bun -
```

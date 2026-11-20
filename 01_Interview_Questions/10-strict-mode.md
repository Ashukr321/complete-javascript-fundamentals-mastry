# Strict Mode

Interview questions on what `"use strict"` changes and where the directive actually takes effect.

## Code examples

### 1. Accidental globals

```js
"use strict";
total = 10;
```

**Output:** `ReferenceError: total is not defined`. Without strict mode this silently creates a global.

### 2. `this` in a plain function call

```js
function show() {
  return this;
}
console.log(show());
```

**Output:** `globalThis` (`window` in a browser) in sloppy mode, `undefined` in strict mode.

### 3. Silent failures become errors

```js
"use strict";
const o = Object.freeze({ a: 1 });
o.a = 2;
```

**Output:** `TypeError: Cannot assign to read only property 'a' of object`. Sloppy mode ignores the write silently.

### 4. Syntax that strict mode forbids

```js
"use strict";
function f(a, a) {}  // SyntaxError: duplicate parameter name
let let = 1;         // SyntaxError: let is a reserved word
const n = 010;       // SyntaxError: octal literals are not allowed
delete Object.prototype; // TypeError: cannot delete
```

### 5. Automatic strict mode

ES modules (`<script type="module">`, `import`/`export` files) and `class` bodies are always strict. No directive needed.

## Counter examples

### ❌ The directive not at the top

```js
console.log("start");
"use strict"; // just a string expression here, not a directive
y = 1;        // works silently — still sloppy mode
```

✅ Put `"use strict";` as the very first statement of the file or function.

### ❌ Strict mode in a function with default parameters

```js
function f(a = 1) {
  "use strict"; // SyntaxError: Illegal 'use strict' directive in function with non-simple parameter list
}
```

✅ Make the whole file strict instead.

### ❌ Losing `this` when extracting a method

```js
"use strict";
const counter = { n: 0, inc() { this.n++; } };
const { inc } = counter;
inc(); // TypeError: Cannot read properties of undefined (reading 'n')
```

✅ `counter.inc()` or `const inc = counter.inc.bind(counter)`.

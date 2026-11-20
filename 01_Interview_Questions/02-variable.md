# Variable

Interview questions on `var`, `let`, `const`, hoisting and the temporal dead zone (TDZ).

## Code examples

### 1. Hoisting `var` vs `let`

```js
console.log(a);
var a = 5;

console.log(b);
let b = 5;
```

**Output:** `undefined`, then `ReferenceError: Cannot access 'b' before initialization`. Both are hoisted, but `let` stays in the TDZ until its line runs.

### 2. The classic loop + `setTimeout`

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j));
```

**Output:** `3 3 3`, then `0 1 2`. `var` has one function-scoped `i`; `let` creates a new binding per iteration.

### 3. `typeof` and the TDZ

```js
console.log(typeof notDeclared);
console.log(typeof x);
let x = 1;
```

**Output:** `"undefined"`, then `ReferenceError`. `typeof` is safe for undeclared names but not for names in the TDZ.

### 4. Function declaration vs function expression

```js
console.log(foo());
function foo() { return "hi"; }

console.log(bar());
var bar = function () { return "hi"; };
```

**Output:** `"hi"`, then `TypeError: bar is not a function`. Declarations are hoisted with their body; `var bar` is hoisted as `undefined`.

### 5. Block scope

```js
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x);
console.log(y);
```

**Output:** `1`, then `ReferenceError: y is not defined`. `var` ignores blocks; `let` and `const` are block-scoped.

### 6. `var` on the global object (browser script)

```js
var g = 1;
let l = 2;
console.log(window.g, window.l);
```

**Output:** `1 undefined`. Top-level `var` becomes a property of `window`; `let` does not.

## Counter examples

### ❌ Thinking `const` makes a value immutable

```js
const settings = { theme: "light" };
settings.theme = "dark"; // allowed
```

✅ `Object.freeze(settings)` blocks changes (shallow only).

### ❌ Declaring `const` without a value

```js
const PI; // SyntaxError: Missing initializer in const declaration
```

### ❌ Redeclaring with `let`

```js
let count = 1;
let count = 2; // SyntaxError: Identifier 'count' has already been declared
```

### ❌ Expecting the outer variable before an inner `let`

```js
let x = 1;
{
  console.log(x); // ReferenceError — the inner x shadows the outer one and is still in the TDZ
  let x = 2;
}
```

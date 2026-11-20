# Destructuring

Interview questions on array and object destructuring: skipping, defaults, renaming, nesting and rest.

## Code examples

### 1. Skip, default and rest

```js
const [a, , b = 5, ...rest] = [1, 2, undefined, 4, 5];
console.log(a, b, rest);
```

**Output:** `1 5 [4, 5]`.

### 2. Defaults apply only to `undefined`

```js
const { x = 10, y = 10 } = { x: null, y: undefined };
console.log(x, y);
```

**Output:** `null 10`. `null` is a value, so the default is skipped.

### 3. Swap without a temp variable

```js
let p = 1, q = 2;
[p, q] = [q, p];
console.log(p, q);
```

**Output:** `2 1`.

### 4. Rename, default and nested

```js
const user = { name: "Ashu", address: { city: "Delhi" } };
const { name: userName, age = 18, address: { city } } = user;
console.log(userName, age, city);
console.log(address);
```

**Output:** `Ashu 18 Delhi`, then `ReferenceError: address is not defined`. A nested pattern does not create a variable for the parent key.

### 5. Destructuring parameters

```js
function area({ w = 1, h = 2 } = {}) {
  return w * h;
}
console.log(area());
console.log(area({ w: 5 }));
```

**Output:** `2`, then `10`.

### 6. Object rest

```js
const { id, ...others } = { id: 1, name: "x", role: "y" };
console.log(others);
```

**Output:** `{ name: "x", role: "y" }`.

## Counter examples

### ❌ Destructuring `undefined` or `null`

```js
const { a } = undefined; // TypeError: Cannot destructure property 'a' of 'undefined'
```

✅ `const { a } = data ?? {};`

### ❌ A nested key that might be missing

```js
const { address: { city } } = {}; // TypeError
```

✅ `const { address: { city } = {} } = user;`

### ❌ Assigning to existing variables without parentheses

```js
let a;
{ a } = { a: 1 };   // SyntaxError — `{` starts a block
({ a } = { a: 1 }); // ✅
```

### ❌ Rest that is not last

```js
const [...first, last] = [1, 2, 3]; // SyntaxError: Rest element must be last element
```

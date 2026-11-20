# Truthy & Falsy

Interview questions on the eight falsy values and the surprising things that are truthy.

## Code examples

### 1. Which lines print?

```js
if ("0") console.log("A");
if ([]) console.log("B");
if ({}) console.log("C");
if (" ") console.log("D");
if (0n) console.log("E");
if (-0) console.log("F");
if (NaN) console.log("G");
```

**Output:** `A B C D`. The only falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`.

### 2. Double negation

```js
console.log(!!"false");
console.log(!![]);
console.log(!!null);
```

**Output:** `true`, `true`, `false`.

### 3. Truthy but loosely equal to `false`

```js
console.log([] == false);
console.log(Boolean([]));
```

**Output:** `true`, then `true`. `==` converts `[]` → `""` → `0`, while a boolean check only asks "is it an object?".

### 4. `filter(Boolean)`

```js
console.log([0, 1, "", "a", null, NaN, [], {}].filter(Boolean));
```

**Output:** `[1, "a", [], {}]`.

## Counter examples

### ❌ Treating `0` as "no value"

```js
function show(count) {
  if (!count) return "No data";
  return `Count: ${count}`;
}
show(0); // "No data" — but 0 is a real count
```

✅ `if (count == null)` (checks only `null` and `undefined`).

### ❌ Checking an empty array or object with `if`

```js
if ([]) console.log("has items"); // runs
if ({}) console.log("has keys");  // runs
```

✅ `arr.length > 0` and `Object.keys(obj).length > 0`.

### ❌ Wrapper objects

```js
if (new Boolean(false)) console.log("runs"); // objects are always truthy
```

✅ Use the primitive `false`, or `Boolean(x)` without `new`.

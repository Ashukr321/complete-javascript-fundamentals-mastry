# Data Type

Interview questions on primitives vs references: copying, comparing and mutating values.

## Code examples

### 1. Copy by value vs copy by reference

```js
let a = 10;
let b = a;
b = 20;
console.log(a);

const o1 = { n: 1 };
const o2 = o1;
o2.n = 2;
console.log(o1.n);
```

**Output:** `10`, then `2`. A primitive is copied; an object variable holds a reference, so `o1` and `o2` point to the same object.

### 2. Comparing objects

```js
console.log({} === {});
console.log([1] == [1]);
const obj = {};
console.log(obj === obj);
```

**Output:** `false`, `false`, `true`. Objects compare by reference (address), not by content.

### 3. Tricky `typeof` results

```js
console.log(typeof null);
console.log(typeof NaN);
console.log(typeof 10n);
console.log(typeof Symbol("id"));
```

**Output:** `"object"`, `"number"`, `"bigint"`, `"symbol"`. `typeof null === "object"` is a historical bug kept for compatibility.

### 4. Mutating a `const`

```js
const arr = [1, 2];
arr.push(3);
console.log(arr);
arr = [];
```

**Output:** `[1, 2, 3]`, then `TypeError: Assignment to constant variable.` `const` locks the reference, not the contents.

### 5. Strings are immutable

```js
let s = "hello";
s[0] = "H";
console.log(s);
```

**Output:** `"hello"`. The assignment is silently ignored (a `TypeError` in strict mode).

### 6. Passing values into a function

```js
function update(x, obj) {
  x = 99;
  obj.v = 99;
  obj = { v: 0 };
}
let n = 1;
const o = { v: 1 };
update(n, o);
console.log(n, o.v);
```

**Output:** `1 99`. JavaScript always passes a copy: of the value for primitives, of the reference for objects. Mutating through the reference is visible outside; reassigning the parameter is not.

## Counter examples

### ❌ Expecting spread to deep-copy

```js
const user = { name: "Ashu", address: { city: "Delhi" } };
const copy = { ...user };
copy.address.city = "Pune";
console.log(user.address.city); // "Pune" — spread is shallow
```

✅ Use `structuredClone(user)` for a deep copy.

### ❌ Checking for an object with `typeof` alone

```js
const value = null;
if (typeof value === "object") value.key; // TypeError
```

✅ `value !== null && typeof value === "object"`.

### ❌ Comparing floats exactly

```js
console.log(0.1 + 0.2 === 0.3); // false (0.30000000000000004)
```

✅ `Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON`.

### ❌ Mixing BigInt and Number

```js
10n + 1; // TypeError: Cannot mix BigInt and other types
```

✅ `10n + BigInt(1)` or `Number(10n) + 1`.

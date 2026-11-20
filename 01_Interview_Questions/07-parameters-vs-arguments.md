# Parameters vs Arguments

Interview questions on default and rest parameters, the `arguments` object and `function.length`.

## Code examples

### 1. Defaults, `undefined` and `null`

```js
function sum(a, b = a * 2, ...rest) {
  return [a, b, rest];
}
console.log(sum(1));
console.log(sum(1, undefined));
console.log(sum(1, null));
console.log(sum(1, 2, 3, 4));
console.log(sum.length);
```

**Output:** `[1, 2, []]`, `[1, 2, []]`, `[1, null, []]`, `[1, 2, [3, 4]]`, `1`. A default kicks in only for `undefined`. `length` counts parameters before the first default or rest.

### 2. The `arguments` object

```js
function f() {
  console.log(arguments.length, Array.isArray(arguments));
}
f(1, 2, 3);
```

**Output:** `3 false`. `arguments` is array-like, not an array.

### 3. Arrow functions have no `arguments`

```js
function outer() {
  const inner = () => arguments[0];
  return inner("ignored");
}
console.log(outer("outer arg"));
```

**Output:** `"outer arg"`. The arrow uses the `arguments` of the enclosing function.

### 4. Defaults are evaluated on every call

```js
function add(item, list = []) {
  list.push(item);
  return list;
}
console.log(add(1));
console.log(add(2));
```

**Output:** `[1]`, then `[2]`. A new array is created for each call.

## Counter examples

### ❌ Calling array methods on `arguments`

```js
function total() {
  return arguments.reduce((s, n) => s + n, 0); // TypeError: arguments.reduce is not a function
}
```

✅ `function total(...nums) { return nums.reduce((s, n) => s + n, 0); }`

### ❌ A default that uses a later parameter

```js
function f(a = b, b = 1) {}
f(); // ReferenceError: Cannot access 'b' before initialization
```

### ❌ The old `||` default

```js
function setVolume(v) {
  v = v || 50;
  return v;
}
setVolume(0); // 50 — 0 was a valid volume
```

✅ `function setVolume(v = 50) {}` or `v ?? 50`.

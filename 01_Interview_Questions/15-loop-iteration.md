# Loop & Iteration

Interview questions on `for`, `for...in`, `for...of`, `while`, `do...while` and iterables.

## Code examples

### 1. `for...in` vs `for...of` on an array

```js
const arr = ["a", "b"];
arr.extra = "x";
for (const i in arr) console.log(i);
for (const v of arr) console.log(v);
```

**Output:** `"0" "1" "extra"`, then `"a" "b"`. `for...in` gives string keys, including added properties; `for...of` gives values.

### 2. `for...of` on a plain object

```js
const obj = { a: 1 };
for (const v of obj) console.log(v);
```

**Output:** `TypeError: obj is not iterable`. Use `Object.entries(obj)` instead.

### 3. `for...in` walks the prototype chain

```js
const parent = { a: 1 };
const child = Object.create(parent);
child.b = 2;
for (const k in child) console.log(k);
console.log(Object.keys(child));
```

**Output:** `b a`, then `["b"]`.

### 4. `do...while` runs at least once

```js
let n = 5;
do {
  console.log(n);
} while (n < 3);
```

**Output:** `5`.

### 5. A custom iterable

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let cur = this.from;
    const last = this.to;
    return { next: () => (cur <= last ? { value: cur++, done: false } : { value: undefined, done: true }) };
  },
};
console.log([...range]);
```

**Output:** `[1, 2, 3]`. Anything with `[Symbol.iterator]` works with `for...of` and spread.

## Counter examples

### ❌ `break` or `return` inside `forEach`

```js
[1, 2, 3].forEach((n) => {
  if (n === 2) return; // only skips this callback; the loop continues
  console.log(n);      // 1, 3
});
```

✅ Use `for...of` with `break`, or `some`/`find`.

### ❌ Removing items while looping forward

```js
const nums = [1, 2, 2, 3];
for (let i = 0; i < nums.length; i++) if (nums[i] === 2) nums.splice(i, 1);
console.log(nums); // [1, 2, 3] — the second 2 was skipped
```

✅ `nums.filter((n) => n !== 2)` or loop backwards.

### ❌ `await` inside `forEach`

```js
ids.forEach(async (id) => await save(id));
console.log("done"); // runs before any save finishes
```

✅ `for (const id of ids) await save(id);` or `await Promise.all(ids.map(save))`.

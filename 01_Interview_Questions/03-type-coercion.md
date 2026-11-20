# Type Coercion

Interview questions on implicit and explicit conversion: the `+` operator, `Number()`, `parseInt()` and object-to-primitive rules.

## Code examples

### 1. Predict the output

```js
console.log(1 + "2");
console.log("3" - 1);
console.log("3" * "4");
console.log(true + 1);
console.log(null + 1);
console.log(undefined + 1);
console.log("5" + 3 - 2);
console.log(1 + 2 + "3");
```

**Output:** `"12"`, `2`, `12`, `2`, `1`, `NaN`, `51`, `"33"`. `+` concatenates if either side is a string; `-`, `*` and `/` always convert to numbers. Evaluation goes left to right.

### 2. Arrays and objects with `+`

```js
console.log([] + []);
console.log([] + {});
console.log([1, 2] + [3]);
```

**Output:** `""`, `"[object Object]"`, `"1,23"`. Objects are turned into strings first.

### 3. The "banana" trick

```js
console.log("b" + "a" + +"a" + "a");
```

**Output:** `"baNaNa"`. Unary `+"a"` is `NaN`.

### 4. Explicit conversion edge cases

```js
Number("");          // 0
Number(" 12 ");      // 12
Number("12px");      // NaN
parseInt("12px");    // 12
Number(null);        // 0
Number(undefined);   // NaN
Number([]);          // 0
Number([5]);         // 5
Number([1, 2]);      // NaN
Boolean("0");        // true
String(null);        // "null"
parseInt(0.0000005); // 5 — the number becomes "5e-7" first
```

### 5. Object to primitive

```js
const price = {
  valueOf() { return 42; },
  toString() { return "price"; },
};
console.log(price + 1);
console.log(`${price}`);
```

**Output:** `43`, then `"price"`. Math uses `valueOf` first; a string context uses `toString` first.

## Counter examples

### ❌ `map(parseInt)`

```js
["1", "2", "3"].map(parseInt); // [1, NaN, NaN] — the index is passed as the radix
```

✅ `["1", "2", "3"].map(Number)`.

### ❌ Forgetting form inputs are strings

```js
const qty = input.value; // "10"
qty + 5;                 // "105"
```

✅ `Number(input.value) + 5`.

### ❌ Checking for NaN with `===` or the global `isNaN`

```js
NaN === NaN;         // false
isNaN("abc");        // true  — coerces "abc" to NaN first
Number.isNaN("abc"); // false
```

✅ Use `Number.isNaN(value)`.

# Equality & Comparison

Interview questions on `==` vs `===`, relational comparison and `Object.is`.

## Code examples

### 1. Loose vs strict equality

```js
console.log(1 == "1");
console.log(1 === "1");
console.log(0 == "");
console.log(0 == "0");
console.log("" == "0");
console.log(null == undefined);
console.log(null === undefined);
console.log(NaN == NaN);
console.log([] == ![]);
```

**Output:** `true`, `false`, `true`, `true`, `false`, `true`, `false`, `false`, `true`. `==` is not transitive (`0 == ""` and `0 == "0"`, yet `"" != "0"`).

### 2. `null` with relational operators

```js
console.log(null == 0);
console.log(null > 0);
console.log(null >= 0);
```

**Output:** `false`, `false`, `true`. `==` treats `null` specially, but `>=` converts `null` to `0`.

### 3. Strings vs numbers

```js
console.log("10" < "9");
console.log(10 < "9");
```

**Output:** `true`, then `false`. Two strings compare character by character; one number forces a numeric comparison.

### 4. Chained comparisons

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Output:** `true`, then `false`. `3 > 2` is `true`, and `true > 1` is `1 > 1`.

### 5. `Object.is`

```js
console.log(NaN === NaN, Object.is(NaN, NaN));
console.log(0 === -0, Object.is(0, -0));
```

**Output:** `false true`, then `true false`.

## Counter examples

### ❌ Comparing arrays or objects by content with `===`

```js
[1, 2] === [1, 2]; // false
```

✅ Compare the contents, e.g. `a.length === b.length && a.every((v, i) => v === b[i])`.

### ❌ Finding `NaN` with `indexOf`

```js
[NaN].indexOf(NaN);  // -1
[NaN].includes(NaN); // true ✅
```

### ❌ Sorting numbers without a compare function

```js
[10, 9, 1].sort();                // [1, 10, 9] — sorted as strings
[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10] ✅
```

### ✅ The one common use of `==`

```js
if (value == null) {} // true for both null and undefined
```

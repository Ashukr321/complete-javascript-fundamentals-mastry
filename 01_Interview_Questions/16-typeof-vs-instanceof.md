# typeof vs instanceof

Interview questions on checking types: what `typeof` reports, how `instanceof` walks the prototype chain, and the reliable alternatives.

## Code examples

### 1. `typeof` surprises

```js
console.log(typeof null);
console.log(typeof []);
console.log(typeof NaN);
console.log(typeof function () {});
console.log(typeof class {});
console.log(typeof undeclaredVar);
console.log(typeof typeof 1);
```

**Output:** `"object"`, `"object"`, `"number"`, `"function"`, `"function"`, `"undefined"`, `"string"`.

### 2. `instanceof` basics

```js
class Animal {}
class Dog extends Animal {}
const d = new Dog();
console.log(d instanceof Dog, d instanceof Animal, d instanceof Object);
console.log([] instanceof Array, [] instanceof Object);
console.log("hi" instanceof String, new String("hi") instanceof String);
console.log(null instanceof Object);
```

**Output:** `true true true`, `true true`, `false true`, `false`. Primitives are never instances.

### 3. `instanceof` checks the prototype, not the constructor

```js
function Car() {}
const c = new Car();
Car.prototype = {};
console.log(c instanceof Car);
```

**Output:** `false`. `c`'s prototype is the old object, which is no longer `Car.prototype`.

### 4. Reliable checks

```js
Array.isArray([]);                          // true
value === null;                             // null check
Number.isNaN(value);                        // NaN check
Object.prototype.toString.call(new Date()); // "[object Date]"
```

## Counter examples

### ❌ Looking for an `"array"` type

```js
typeof [] === "array"; // always false
```

✅ `Array.isArray(value)`.

### ❌ `typeof x === "object"` for plain objects

It is also `true` for `null` and arrays. ✅ `x !== null && typeof x === "object" && !Array.isArray(x)`.

### ❌ `instanceof` with primitives

```js
5 instanceof Number; // false
```

✅ `typeof 5 === "number"`.

### ❌ `instanceof Array` across iframes

An array from another frame has a different `Array` constructor, so `instanceof Array` is `false`. ✅ `Array.isArray` works across realms.

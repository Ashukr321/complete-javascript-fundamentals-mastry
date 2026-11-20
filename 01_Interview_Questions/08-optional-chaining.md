# Optional Chaining

Interview questions on `?.` for properties, methods and indexes, and where it does not help.

## Code examples

### 1. Predict the output

```js
const user = { profile: null, greet() { return "hi"; }, tags: ["js"] };
console.log(user.profile?.name);
console.log(user.settings?.theme);
console.log(user.greet?.());
console.log(user.bye?.());
console.log(user.tags?.[0]);
console.log(user.settings.theme);
```

**Output:** `undefined`, `undefined`, `"hi"`, `undefined`, `"js"`, then `TypeError: Cannot read properties of undefined (reading 'theme')`.

### 2. Short-circuiting skips the rest

```js
let i = 0;
const arr = null;
arr?.[i++];
console.log(i);
```

**Output:** `0`. Once `arr` is `null`, nothing to the right is evaluated.

### 3. With a fallback

```js
const city = user.address?.city ?? "Unknown";
```

`?.` gives `undefined` when the chain breaks; `??` turns that into a default.

## Counter examples

### ❌ Assigning through `?.`

```js
user?.name = "Ashu"; // SyntaxError: Invalid left-hand side in assignment
```

✅ `if (user) user.name = "Ashu";`

### ❌ Expecting it to guard undeclared variables

```js
notDeclared?.x; // ReferenceError: notDeclared is not defined
```

### ❌ Expecting `?.()` to check the type

```js
const obj = { run: "not a function" };
obj.run?.(); // TypeError: obj.run is not a function — `?.` only skips null/undefined
```

### ❌ Hiding bugs

Using `?.` on data that must exist turns a clear error into a silent `undefined`. Use it only where a missing value is expected.

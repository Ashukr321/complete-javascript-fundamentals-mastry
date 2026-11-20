# Short-circuit Evaluation

Interview questions on what `&&` and `||` return and when the right side never runs.

## Code examples

### 1. Return values, not booleans

```js
console.log(0 && "a");
console.log(1 && "a");
console.log("" || "def");
console.log("x" || "def");
console.log(1 && 2 && 3);
console.log(1 && 0 && 3);
console.log(0 || null || "a" || "b");
```

**Output:** `0`, `"a"`, `"def"`, `"x"`, `3`, `0`, `"a"`. `&&` returns the first falsy value (or the last); `||` returns the first truthy value (or the last).

### 2. Precedence

```js
console.log(true || false && false);
```

**Output:** `true`. `&&` binds tighter: `true || (false && false)`.

### 3. Skipped side effects

```js
let calls = 0;
const inc = () => ++calls;
false && inc();
true || inc();
null ?? inc();
console.log(calls);
```

**Output:** `1`. Only `null ?? inc()` runs `inc`.

### 4. Guard and default patterns

```js
user && user.login();          // call only if user exists
const port = env.PORT || 3000; // default for an empty value
```

## Counter examples

### ❌ Rendering `0` in JSX

```jsx
{items.length && <List items={items} />} // shows "0" when the list is empty
```

✅ `{items.length > 0 && <List items={items} />}`

### ❌ `||` defaults that break on `0` or `""`

```js
const limit = opts.limit || 10; // limit: 0 becomes 10
```

✅ `opts.limit ?? 10`.

### ❌ Expecting a boolean

```js
const isAdmin = user && user.role === "admin";
// user is null → isAdmin is null, not false
```

✅ `const isAdmin = user?.role === "admin";`

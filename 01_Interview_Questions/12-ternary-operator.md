# Ternary Operator

Interview questions on `condition ? a : b`: chaining, precedence and when not to use it.

## Code examples

### 1. Basic and chained

```js
const age = 20;
console.log(age >= 18 ? "Adult" : "Minor");

const marks = 75;
const grade = marks >= 90 ? "A" : marks >= 60 ? "B" : marks >= 40 ? "C" : "F";
console.log(grade);
```

**Output:** `Adult`, then `B`.

### 2. Truthiness of the condition

```js
console.log("x" ? "yes" : "no");
console.log(0 ? "yes" : "no");
console.log([] ? "yes" : "no");
```

**Output:** `yes`, `no`, `yes`.

### 3. Right-associative

```js
console.log(true ? "a" : false ? "b" : "c");
```

**Output:** `"a"`. It groups as `true ? "a" : (false ? "b" : "c")`.

### 4. Precedence trap

```js
const total = 10 + true ? 1 : 2;
console.log(total);
```

**Output:** `1`. It is read as `(10 + true) ? 1 : 2`.

### 5. Inside a template literal

```js
const n = 1;
console.log(`You have ${n} item${n === 1 ? "" : "s"}`);
```

**Output:** `You have 1 item`.

## Counter examples

### ❌ Statements inside a ternary

```js
isValid ? return a : return b; // SyntaxError
return isValid ? a : b;        // ✅
```

### ❌ Redundant boolean ternary

```js
const ok = isValid ? true : false; // ❌
const ok2 = Boolean(isValid);      // ✅
```

### ❌ Deep nesting

```js
const label = s === 1 ? "new" : s === 2 ? "open" : s === 3 ? "done" : "unknown";
```

✅ A lookup object is clearer: `({ 1: "new", 2: "open", 3: "done" })[s] ?? "unknown"`.

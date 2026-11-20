# Nullish Coalescing

Interview questions on `??`, `??=` and how they differ from `||`.

## Code examples

### 1. `??` vs `||`

```js
console.log(0 ?? 5);
console.log("" ?? "x");
console.log(false ?? true);
console.log(null ?? "default");
console.log(undefined ?? NaN);
console.log(0 || 5);
console.log("" || "x");
```

**Output:** `0`, `""`, `false`, `"default"`, `NaN`, `5`, `"x"`. `??` falls back only on `null` and `undefined`.

### 2. Logical assignment

```js
const cfg = { retries: 0, name: "" };
cfg.retries ??= 3;
cfg.name ||= "app";
cfg.timeout ??= 1000;
console.log(cfg);
```

**Output:** `{ retries: 0, name: "app", timeout: 1000 }`.

### 3. Precedence with arithmetic

```js
console.log(null ?? 1 + 1);
```

**Output:** `2`. `+` binds tighter, so this is `null ?? 2`.

## Counter examples

### ❌ Mixing `??` with `||` or `&&` without parentheses

```js
const v = a || b ?? c; // SyntaxError
const v2 = (a || b) ?? c; // ✅
```

### ❌ Using `||` for numeric settings

```js
const volume = settings.volume || 50; // volume 0 becomes 50
const volume2 = settings.volume ?? 50; // ✅ keeps 0
```

### ❌ Expecting `??` to catch bad input

```js
const age = Number("abc") ?? 18; // NaN — NaN is not null/undefined
```

✅ Validate explicitly: `Number.isNaN(n) ? 18 : n`.

# Shadowing

Interview questions on inner variables hiding outer ones, including illegal shadowing.

## Code examples

### 1. Basic shadowing

```js
let x = 10;
function test() {
  let x = 20;
  console.log(x);
}
test();
console.log(x);
```

**Output:** `20`, then `10`.

### 2. Legal vs illegal shadowing

```js
var b = 1;
{
  let b = 2;
  console.log(b);
}
console.log(b);

let a = 1;
{
  var a = 2; // SyntaxError: Identifier 'a' has already been declared
}
```

**Output:** `2 1` for the first part; the second part fails to parse. `var` is hoisted out of the block and collides with the outer `let`.

### 3. Hoisting inside the shadowing scope

```js
var name = "global";
function show() {
  console.log(name);
  var name = "local";
}
show();
```

**Output:** `undefined`. The inner `var name` is hoisted to the top of `show`, shadowing the global.

### 4. Shadowing parameters

```js
function f(x) { { let x = 5; } return x; }
function h(x) { var x; return x; }
console.log(f(1), h(1));
function g(x) { let x = 5; } // SyntaxError: Identifier 'x' has already been declared
```

**Output:** `1 1`. A block may shadow a parameter, and `var x` just redeclares it, but `let x` in the same scope is an error.

## Counter examples

### ❌ Accidentally updating a copy

```js
let count = 0;
function increment() {
  let count = 0; // shadows the outer count
  count++;
}
increment();
console.log(count); // 0
```

✅ Remove the inner declaration so `count++` updates the outer variable.

### ❌ Shadowing browser globals

```js
var name = 123;
console.log(typeof name); // "string" in a browser script — window.name is always a string
```

✅ Use descriptive names and the ESLint `no-shadow` rule.

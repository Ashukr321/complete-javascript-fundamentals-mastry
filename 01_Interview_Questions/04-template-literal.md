# Template Literal

Interview questions on backtick strings: interpolation, multi-line strings, tagged templates and `String.raw`.

## Code examples

### 1. Interpolation vs plain quotes

```js
const a = 5, b = 10;
console.log(`Sum: ${a + b}`);
console.log("Sum: ${a + b}");
```

**Output:** `Sum: 15`, then `Sum: ${a + b}`. Only backticks interpolate.

### 2. What gets printed for non-strings

```js
console.log(`${[1, 2, 3]}`);
console.log(`${{}}`);
console.log(`${null} ${undefined}`);
```

**Output:** `1,2,3`, `[object Object]`, `null undefined`. Values are converted with `String()`.

### 3. Nesting templates

```js
const name = "Ashu", isAdmin = true;
console.log(`Hello ${isAdmin ? `Admin ${name}` : "Guest"}`);
```

**Output:** `Hello Admin Ashu`.

### 4. Tagged templates

```js
function tag(strings, ...values) {
  console.log(strings, values);
}
tag`Hello ${"Ashu"}, you are ${25}`;
```

**Output:** `["Hello ", ", you are ", ""]` and `["Ashu", 25]`. There is always one more string than values.

### 5. `String.raw`

```js
console.log(String.raw`C:\new\table`);
console.log(`C:\new\table`);
```

**Output:** `C:\new\table`, then `C:` followed by a newline, `ew`, a tab and `able`. `String.raw` keeps backslashes as written.

## Counter examples

### ❌ Interpolating an object

```js
const user = { name: "Ashu" };
console.log(`User: ${user}`); // "User: [object Object]"
```

✅ `JSON.stringify(user)` or a field such as `user.name`.

### ❌ Forgetting that multi-line strings keep indentation

```js
function msg() {
  return `Line 1
    Line 2`; // "    Line 2" keeps its leading spaces
}
```

✅ Join an array of lines, or remove the indentation.

### ❌ Building HTML from user input

```js
list.innerHTML = `<li>${comment}</li>`; // XSS if comment contains <img onerror=...>
```

✅ Create the element and set `li.textContent = comment`.

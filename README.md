<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" width="120"/>
</p>

<h1 align="center">Complete JavaScript Fundamentals Mastery</h1>

---

## Topics

| #  | Topic                        | Key Points                                          |
|----|------------------------------|-----------------------------------------------------|
| 1  | Data Type                    | Primitive (stack) vs Reference (heap)                |
| 2  | Variable                     | `var`, `let`, `const`, hoisting, TDZ                 |
| 3  | Type Coercion                | Implicit vs Explicit conversion                      |
| 4  | Template Literal             | Backticks, interpolation, multi-line                 |
| 5  | Truthy & Falsy               | 8 falsy values, everything else truthy               |
| 6  | Destructuring                | Array `[]`, Object `{}`, rest, default, rename       |
| 7  | Parameters vs Arguments      | Rest `...`, default params, arguments object         |
| 8  | Optional Chaining            | `?.` safe access, returns `undefined` not error      |
| 9  | Equality & Comparison        | `==` (coercion) vs `===` (strict)                    |
| 10 | Strict Mode                  | ES5, safer code, no duplicates, restricted keywords  |
| 11 | Nullish Coalescing           | `??` operator                                        |
| 12 | Ternary Operator             | `condition ? a : b`                                  |
| 13 | Shadowing                    | Inner scope variable hides outer                     |
| 14 | Short-circuit Evaluation     | `&&` and `\|\|` early exit                           |
| 15 | Loop & Iteration             | `for`, `for...in`, `for...of`, `while`, `do...while` |
| 16 | typeof vs instanceof         | Type checking approaches                             |

---

## Data Type
- Primitive Data Type (Immutable) — stored in stack
  - Number
  - String
  - Boolean
  - undefined
  - null
  - BigInt
  - Symbol
- Reference Data Type (Mutable) — stored in heap
  - Object, Array, Function, Date, Map etc.
  - Variable holds reference, not actual value
  - Reference comparison returns false (different addresses)
  - `const` prevents reassigning the reference, not mutating the value

## Variable
- `var` — redeclaration & reassignment allowed, hoisted with value `undefined`
- `let` — no redeclaration, reassignment allowed, hoisted but in TDZ
- `const` — no redeclaration, no reassignment, hoisted but in TDZ

## Type Coercion
- Implicit — JS auto-converts types
  - `+` operator special behavior (string concatenation)
  - `-` `*` `/` convert to number
- Explicit — developer converts manually
  - `Number()`, `String()`, `Boolean()`, `parseInt()`
  - Object to Primitive conversion

## Template Literal
- Uses backticks `` ` `` for strings
- Multi-line string support
- String interpolation: `` `${variable}` ``

## Truthy & Falsy Values
- Falsy: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`
- Everything else is truthy (including `"0"`, `"false"`, `[]`, `{}`)

## Destructuring
ES6 feature that allows extracting values from arrays or properties from objects and assigning them into variables in a concise way.

- **Array Destructuring**
  - `[]` syntax
  - `...` rest operator — collects remaining elements
  - `=` default value
  - `,` skip element

- **Object Destructuring**
  - Works based on property name, not position
  - `{}` syntax
  - Rename while destructuring: `const { name: userName } = user`
  - Default value support
  - Dot notation for access
  - Bracket notation when key has special characters: `user["my-age"]`

## Parameters vs Arguments
- **Parameters** — variables defined in the function
  - Rest parameter (`...`) — takes all arguments into a single array
  - Default parameter — allows giving a default value to parameters
- **Arguments** — actual values passed when calling the function

## Optional Chaining
Safely access properties — widely used with API responses. Returns `undefined` instead of throwing an error if a property is not found.
```js
user?.name             // property
user?.address?.city    // nested property
user?.sayHello?.()     // method
users?.[0]             // array/dynamic property
```

## Equality & Comparison
- `==` (loose equality) — compares value, may perform type coercion if types differ
- `===` (strict equality) — compares both value and type, no type coercion

## Strict Mode
Introduced in ES5. Makes code safer:
- Prevents deleting non-configurable properties
- Disallows duplicate parameter names in functions
- Reserved words become restricted

## Nullish Coalescing

## Ternary Operator

## Shadowing

## Short-circuit Evaluation

## Loop & Iteration
- For Loop
- For In Loop
- For Of Loop
- While Loop
- Do While Loop

## typeof vs instanceof

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
- Array
- Object

## Parameters vs Arguments
- Rest Parameters
- Default Parameters
- Argument Object
- Spread

## Optional Chaining

## Equality & Comparison
- == vs ===

## Strict Mode

## Nullish Coalescing

## Ternary Operators

## Shadowing

## Short-circuit Evaluation

## Loop and Iteration
- For Loop
- For In Loop
- For Of Loop
- While Loop
- Do While Loop

## typeof vs instanceof

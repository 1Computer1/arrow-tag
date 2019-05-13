# arrow-tag

Function arrows and a template tag for arrows and function combinators.  

The design philosophy of this library (other than being a proof-of-concept) is to give programmers a way to
compose their functions without having to resort to a messy nesting of combinators nor having to mess with
their functions through a middleman e.g. currying.  

This library is based upon `Control.Arrow`, with liberties taken to ease its use in JavaScript.  

## Example

With arrow-tag language and template tag:  

```js
const { arrow, operators: { add, pow, rsect } } = require('arrowtag');

// Read this as "add on (** 2) then square root".
// That is, `(x, y) => Math.sqrt(x ** 2 + y ** 2)`.
const pythag = arrow`${add} <^> ${rsect(pow, 2)} >>> ${Math.sqrt}`;

pythag(3, 4); // -> 5
```

Equivalent function calls:  

```js
const { on, composeLR, operators: { add, pow, rsect } } = require('arrowtag');

const pythag = composeLR(on(add, rsect(pow, 2)), Math.sqrt);

pythag(3, 4); // -> 5
```

## Combinators

All the combinators are available as normal functions or as a part of the arrow-tag language.  
Multiple inputs are the same as normal JavaScript, i.e. we treat function arguments as a single tuple.  
Multiple outputs are simulated using arrays with an `isTuple` symbol set to true.  

Unary combinators have a corresponding prefix operator.  
Binary operators also have an associativity and precedence; higher precedence means tighter binding.  
You can view the full list of combinators and their behavior in `src/combinators.js`.  
Notation is fairly obvious; `(...a)` refers to the entire spread of types passed into the function.  

Also included are aliases for JavaScript operators, e.g. `add` for `(x, y) => x + y`.  
You can also create operator sections as in `lsect(1, add)` for `x => 1 + x`.  

## More Examples

```js
const f = arrow`${rsect(mul, 2)} >>> ${String} >>> ${rsect(add, ' wow!')}`;
f(10); // -> "20, wow!"
```

```js
const f = arrow`${rsect(pow, 2)} &&& ${Math.sqrt}`;
f(4); // -> [16, 2]
```

```js
const f = arrow`${sub} <^> ${x => x.age}`;
[{ age: 10 }, { age: 3 }].sort(f); // -> [{ age: 3 }, { age: 10 }]
```

```js
const f = arrow`${rsect(mul, 10)} @ 2`;
f(1, 2, 3, 4); // -> [1, 2, 30, 4, [Symbol(isTuple)]: true]
```

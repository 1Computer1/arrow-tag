# arrow-tag

Function arrows and a template tag for arrows and function combinators.

## Example

With arrow-tag language and template tag:
```js
const { arrow } = require('arrowtag');

const add = (x, y) => x + y;
const square = x => x ** 2;
const sqrt = Math.sqrt;

const pythag = arrow`${add} <^> ${square} >>> ${sqrt}`;

pythag(3, 4); // -> 5
```

Equivalent function calls:
```js
const { on, composeLR } = require('arrowtag');

const add = (x, y) => x + y;
const square = x => x ** 2;
const sqrt = Math.sqrt;

const pythag = composeLR(on(add, square), sqrt);

pythag(3, 4); // -> 5
```

## Combinators

All the combinators are available as normal functions or as a part of the arrow-tag language.  
Multiple inputs are the same as normal JavaScript, i.e. we treat function arguments as a single tuple.  
Multiple outputs are simulated using arrays with an `isTuple` symbol set to true.  

Unary combinators have a corresponding prefix operator.  
Binary operators also have an associativity and precedence; higher precedence means tighter binding.  
You can view the full list of combinators and their behavior in `src/combinators.js`.  
Notation is fairly obvious; `(...a)` refers to all arguments of the function in parameters position and to an unknown amount of values in return position.  

Also included are aliases for JavaScript operators, e.g. `add` for `(x, y) => x + y`.  
You can also create operator sections as in `lsect(add, 1)` for `x => 1 + x`.  

## More Examples

```js
const f = arrow`${x => x * 2} >>> ${String} >>> ${x => x + ', wow!'}`;
f(10); // 20, wow!
```

```js
const f = arrow`${x => x ** 2} &&& ${x => Math.sqrt(x)}`;
f(4); // [16, 2]
```

```js
const f = arrow`${(x, y) => x - y} <^> ${x => x.age}`;
[{ age: 10 }, { age: 3 }].sort(f); // [{ age: 3 }, { age: 10 }]
```

```js
const f = arrow`${x => x * 10} @ 2`;
f(1, 2, 3, 4); // [1, 2, 30, 4]
```

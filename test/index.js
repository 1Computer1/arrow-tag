// Very incomplete tests.

const { arrow, operators: { add, mul } } = require('..');

const f = arrow`${x => [x]} @ 1 >>> ${(x, y, z) => [x, y, z]}`;
console.log(f(1, 2, 3));

const pythag = arrow`${add} <^> #${mul} >>> ${Math.sqrt}`;
console.log(pythag(3, 4));

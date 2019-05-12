// Very incomplete tests.

const { arrow } = require('..');

const f = arrow`${x => [x]} @ 1 >>> ${(x, y, z) => [x, y, z]}`;
console.log(f(1, 2, 3));

const pythag = arrow`${(x, y) => x + y} <^> ${x => x * x} >>> ${Math.sqrt}`;
console.log(pythag(3, 4));

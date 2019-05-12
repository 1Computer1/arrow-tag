// Very incomplete tests.

const { arrow } = require('..');

const f = arrow`${x => [x]} @ 1 >>> ${(x, y, z) => [x, y, z]}`;
console.log(f(1, 2, 3));

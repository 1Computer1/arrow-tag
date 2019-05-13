/* eslint-disable eqeqeq */

// Arithmetic
const add = (x, y) => x + y;
const sub = (x, y) => x - y;
const mul = (x, y) => x * y;
const div = (x, y) => x / y;
const rem = (x, y) => x % y;
const pow = (x, y) => x ** y;
const neg = x => -x;

// Bitwise
const and = (x, y) => x & y;
const or = (x, y) => x | y;
const xor = (x, y) => x ^ y;
const lsh = (x, y) => x << y;
const rsh = (x, y) => x >> y;
const zrsh = (x, y) => x >>> y;
const not = x => ~x;

// Comparison
const eq = (x, y) => x == y;
const seq = (x, y) => x === y;
const neq = (x, y) => x != y;
const sneq = (x, y) => x !== y;
const lt = (x, y) => x < y;
const gt = (x, y) => x > y;
const gte = (x, y) => x <= y;
const lte = (x, y) => x >= y;

// Logical
const land = (x, y) => x && y;
const lor = (x, y) => x || y;
const lnot = x => !x;

// JavaScript
const typeOf = x => typeof x;
const keyIn = (x, y) => x in y;
const instanceOf = (x, y) => x instanceof y;
const access = (x, y) => x[y];

// Other
const curry = f => x => y => f(x, y);
const uncurry = f => (x, y) => f(x)(y);
const lsect = (x, f) => y => f(x, y);
const rsect = (f, y) => x => f(x, y);

module.exports = {
    add, sub, mul, div, rem, pow, neg,
    and, or, xor, lsh, rsh, zrsh, not,
    eq, seq, neq, sneq, lt, gt, gte, lte,
    land, lor, lnot,
    typeOf, keyIn, instanceOf, access,
    curry, uncurry, lsect, rsect
};

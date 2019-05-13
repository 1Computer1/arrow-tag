const { tuple, spreadTuple } = require('./tuples');

/**
 * `join : ((a, a) -> b) -> (a -> b)`
 * Compresses the two arguments of an arrow into one.
 * `#` in arrow-tag language, prefix operator.
 */
function join(f) {
    return x => f(x, x);
}

/**
 * `reverse : ((...a) -> (...b)) -> ((...a) -> (...b))`
 * Reverses the order of the inputs.
 * `~` in arrow-tag language, prefix operator.
 */
function reverse(f) {
    return (...xs) => f(...xs.slice().reverse());
}

/**
 * `flatMap : (a -> (...b)) -> ((...a) -> (...b))`
 * Maps an arrow over all elements of the input and flattens the outputs.
 * This is not actually a rigorous combinator but it is useful.
 * `$` in arrow-tag language, prefix operator.
 */
function flatMap(f) {
    return (...xs) => {
        const yss = xs.map(x => f(x));
        const zs = [];
        for (const ys of yss) {
            spreadTuple((...args) => zs.push(...args), ys);
        }

        return tuple(...zs);
    };
}

/**
 * `composeLR : ((a -> b), (b -> c)) -> (a -> c)`
 * Left-to-right composition of arrows.
 * `>>>` in arrow-tag language, infixl 1.
 */
function composeLR(f, g) {
    return (...xs) => spreadTuple(g, f(...xs));
}

/**
 * `composeRL : ((b -> c), (a -> b)) -> (a -> c)`
 * Right-to-left composition of arrows.
 * `<<<` in arrow-tag language, infixl 1.
 */
function composeRL(f, g) {
    return (...xs) => spreadTuple(f, g(...xs));
}

/**
 * `substitute : ((a, b) -> c, a -> b) -> (a -> c)`
 * S-combinator on function arrows.
 * `<*>` in arrow-tag language, infixl 3.
 */
function substitute(f, g) {
    return x => f(x, g(x));
}

/**
 * `on : ((b, b) -> c, a -> b) -> ((a, a) -> c)`
 * P-combinator on function arrows.
 * `<^>` in arrow-tag language, infixl 3.
 */
function on(f, g) {
    return (x, y) => f(g(x), g(y));
}

/**
 * `split : (a -> b, c -> d) -> ((a, c) -> (b, d))`
 * Splits the inputs between two arrows and combine their output.
 * `***` in arrow-tag language, infixl 2.
 */
function split(f, g) {
    return (x, y) => tuple(f(x), g(y));
}

/**
 * `fanout : (a -> b, a -> c) -> (a -> (b, c))`
 * Sends the input to the two arrows and combine their output.
 * `&&&` in arrow-tag language, infixl 2.
 */
function fanout(f, g) {
    return x => tuple(f(x), g(x));
}

/**
 * `over : (int, a -> b) -> ((...c, a, ...c) -> (...c, b, ...c))`
 * Sends the `ix`th element of the input through the arrow, keeping the rest unchanged.
 * `@` in arrow-tag language, infixl 4.
 */
function over(ix, f) {
    return (...xs) => {
        const copy = xs.slice();
        copy[ix] = f(copy[ix]);
        return tuple(...copy);
    };
}

module.exports = {
    flatMap,
    join,
    reverse,
    composeLR,
    composeRL,
    substitute,
    on,
    split,
    fanout,
    over
};

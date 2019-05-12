const { parse, lex, evaluate } = require('./parser');
const combinators = require('./util/combinators');
const tuples = require('./util/tuples');

/**
 * Creates an arrow using a custom syntax in a template tag.
 */
function arrow(raws, ...interps) {
    return evaluate(parse(lex(raws, interps)));
}

module.exports = {
    arrow,
    ...combinators,
    ...tuples
};

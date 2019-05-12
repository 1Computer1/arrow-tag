const c = require('../util/combinators');

function evaluate(node) {
    switch (node.type) {
        case 'Atom':
            return evaluateAtom(node);
        case 'Unary':
            return evaluateUnary(node);
        case 'Binary':
            return evaluateBinary(node);
        case 'Over':
            return evaluateOver(node);
        default:
            throw new Error('Invalid node type');
    }
}

function evaluateUnary(node) {
    const f = evaluate(node.value);
    const combs = {
        Arr: c.arr,
        Arrs: c.arrs,
        FlatMap: c.flatMap,
        Join: c.join,
        Reverse: c.reverse
    };

    if (combs[node.op] === null) {
        throw new Error('Invalid unary operator type');
    }

    return combs[node.op](f);
}

function evaluateBinary(node) {
    const f = evaluate(node.lhs);
    const g = evaluate(node.rhs);
    const combs = {
        ComposeLR: c.composeLR,
        ComposeRL: c.composeRL,
        Substitute: c.substitute,
        On: c.on,
        Split: c.split,
        Fanout: c.fanout
    };

    if (combs[node.op] === null) {
        throw new Error('Invalid binary operator type');
    }

    return combs[node.op](f, g);
}

function evaluateOver(node) {
    const f = evaluate(node.value);
    const n = node.ix;
    return c.over(n, f);
}

function evaluateAtom(node) {
    return node.value;
}

module.exports = { evaluate };

const combinators = require('../util/combinators');
const { Nodes, Operators } = require('./grammar');

function evaluate(node) {
    switch (node.type) {
        case Nodes.Value:
            return evaluateValue(node);
        case Nodes.Unary:
            return evaluateUnary(node);
        case Nodes.Binary:
            return evaluateBinary(node);
        case Nodes.Over:
            return evaluateOver(node);
        default:
            throw new Error('Invalid node type');
    }
}

function evaluateUnary(node) {
    const f = evaluate(node.value);
    const combs = {
        [Operators.FlatMap]: combinators.flatMap,
        [Operators.Join]: combinators.join,
        [Operators.Reverse]: combinators.reverse
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
        [Operators.ComposeLR]: combinators.composeLR,
        [Operators.ComposeRL]: combinators.composeRL,
        [Operators.Substitute]: combinators.substitute,
        [Operators.On]: combinators.on,
        [Operators.Split]: combinators.split,
        [Operators.Fanout]: combinators.fanout
    };

    if (combs[node.op] === null) {
        throw new Error('Invalid binary operator type');
    }

    return combs[node.op](f, g);
}

function evaluateOver(node) {
    const f = evaluate(node.value);
    const n = Number(node.ix.value);
    return combinators.over(n, f);
}

function evaluateValue(node) {
    return node.value;
}

module.exports = { evaluate };

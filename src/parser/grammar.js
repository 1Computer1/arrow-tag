const { Lexemes } = require('./lexer');
const { peek, location, many1, oneOf, token, binaryOp } = require('./parser');

/*
    Arrow   = Compose EOF
    Compose = Basic ((">>>" | "<<<") Basic)*
    Basic   = Combine (("***" | "&&&") Combine)*
    Combine = Over (("<*>" | "<^>") Over)*
    Over    = Unary ("@" [0-9]+)*
    Unary   = ("$" | "#" | "~")? Value
    Value   = "${...}" | "(" Arrow ")"
*/

const Nodes = {
    Value: 'Value',
    Unary: 'Unary',
    Binary: 'Binary',
    Over: 'Over'
};

const Operators = {
    // >>>
    ComposeLR: 'ComposeLR',
    // <<<
    ComposeRL: 'ComposeRL',
    // ***
    Split: 'Split',
    // &&&
    Fanout: 'Fanout',
    // <*>
    Substitute: 'Substitute',
    // <^>
    On: 'On',
    // $
    FlatMap: 'FlatMap',
    // #
    Join: 'Join',
    // ~
    Reverse: 'Reverse'
};

function parse(tokens) {
    const state = { tokens, position: 0 };
    return parseArrow(state);
}

function parseArrow(state) {
    const node = parseCompose(state);
    const eof = token(Lexemes.EOF, state);
    if (eof === null) {
        throw makeError(state);
    }

    return node;
}

function parseCompose(state) {
    return binaryOpToAST({
        [Lexemes.LAngle3]: Operators.ComposeRL,
        [Lexemes.RAngle3]: Operators.ComposeLR
    }, parseBasic, state);
}

function parseBasic(state) {
    return binaryOpToAST({
        [Lexemes.Star3]: Operators.Split,
        [Lexemes.Amp3]: Operators.Fanout
    }, parseCombine, state);
}

function parseCombine(state) {
    return binaryOpToAST({
        [Lexemes.StarOp]: Operators.Substitute,
        [Lexemes.CaretOp]: Operators.On
    }, parseOver, state);
}

function parseOver(state) {
    const node1 = parseUnary(state);
    const nodes = many1(() => {
        const at = token(Lexemes.At, state);
        if (at === null) {
            return null;
        }

        return token(Lexemes.Number, state);
    }, state);

    if (nodes === null) {
        return node1;
    }

    return nodes.reduce((value, n) => ({ type: Nodes.Over, value, ix: n }), node1);
}

function parseUnary(state) {
    const ops = many1(() => oneOf([Lexemes.Dollar, Lexemes.Hash, Lexemes.Tilde], state), state);
    const node1 = parseValue(state);
    if (ops === null) {
        return node1;
    }

    return ops.reduceRight((value, op) => ({
        type: Nodes.Unary,
        op: {
            [Lexemes.Dollar]: Operators.FlatMap,
            [Lexemes.Hash]: Operators.Join,
            [Lexemes.Tilde]: Operators.Reverse
        }[op.type],
        value
    }), node1);
}

function parseValue(state) {
    const node1 = token(Lexemes.Interp, state);
    if (node1 !== null) {
        return { type: Nodes.Value, value: node1.value };
    }

    const open = token(Lexemes.LParen, state);
    if (open === null) {
        throw makeError(state);
    }

    const node2 = parseArrow(state);
    token(Lexemes.RParen, state);
    return node2;
}

function makeError(state) {
    if (!peek(state) || peek(state).type === Lexemes.EOF) {
        return new Error(`Unexpected end of input at position ${location(state)}`);
    } else if (peek(state).type === Lexemes.Interp) {
        return new Error(`Unexpected interpolated value at position ${location(state)}`);
    } else {
        return new Error(`Unexpected token ${peek(state).value} at position ${location(state)}`);
    }
}

function binaryOpToAST(table, parse_, state) {
    const [node1, nodes] = binaryOp(table, parse_, state);
    if (nodes === null) {
        return node1;
    }

    return nodes.reduce((lhs, [op, rhs]) => ({ type: Nodes.Binary, lhs, op, rhs }), node1);
}

module.exports = { Nodes, Operators, parse };

const { peek, location, many1, oneOf, token, binaryOp } = require('./parser');

/*
    Arrow  = On
    On     = Comp ("^^^" Comp)*
    Comp   = Basic ((">>>" | "<<<") Basic)*
    Basic  = Sub (("***" | "&&&") Sub)*
    Sub    = Over ("<*>" Over)*
    Over   = Unary ("@" [0-9]+)*
    Unary  = ("$" | "#" | "~")? Atom
    Atom   = Interp | "(" Arrow ")"
    Interp = ...
*/

function parse(tokens) {
    const state = { tokens, position: 0 };
    const a = parseArrow(state);
    const eof = token('EOF', state);
    if (eof === null) {
        throw makeError(state);
    }

    return a;
}

function parseArrow(state) {
    return parseOn(state);
}

function parseOn(state) {
    return binaryOp({ Caret3: 'On' }, parseComp, state);
}

function parseComp(state) {
    return binaryOp({ Left3: 'ComposeRL', Right3: 'ComposeLR' }, parseBasic, state);
}

function parseBasic(state) {
    return binaryOp({ Star3: 'Split', And3: 'Fanout' }, parseSub, state);
}

function parseSub(state) {
    return binaryOp({ Sub: 'Substitute' }, parseOver, state);
}

function parseOver(state) {
    const node1 = parseUnary(state);
    const nodes = many1(s => {
        const at = token('At', s);
        if (at === null) {
            return null;
        }

        return token('Number', s);
    }, state);

    if (nodes === null) {
        return node1;
    }

    return nodes.reduce((value, n) => ({ type: 'Over', value, ix: Number(n.value) }), node1);
}

const unaryTable = {
    Dollar: 'FlatMap',
    Hash: 'Join',
    Tilde: 'Reverse'
};

function parseUnary(state) {
    const ops = many1(s => oneOf(['Dollar', 'Hash', 'Tilde'], s), state);
    const node1 = parseAtom(state);
    if (ops === null) {
        return node1;
    }

    return ops.reduceRight((value, op) => ({ type: 'Unary', op: unaryTable[op.type], value }), node1);
}

function parseAtom(state) {
    const e = token('Interp', state);
    if (e !== null) {
        return { type: 'Atom', value: e.value };
    }

    const open = token('Open', state);
    if (open === null) {
        throw makeError(state);
    }

    const a = parseArrow(state);
    token('Close', state);
    return a;
}

function makeError(state) {
    if (!peek(state) || peek(state).type === 'EOF') {
        return new Error(`Unexpected end of input at position ${location(state)}`);
    } else if (peek(state).type === 'Interp') {
        return new Error(`Unexpected interpolated value at position ${location(state)}`);
    } else {
        return new Error(`Unexpected token ${peek(state).value} at position ${location(state)}`);
    }
}

module.exports = { parse };

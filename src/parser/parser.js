function peek(state) {
    if (state.position >= state.tokens.length) {
        return null;
    }

    return state.tokens[state.position];
}

function location(state) {
    return state.tokens[state.position].position;
}

function next(state, n = 1) {
    if (state.position >= state.tokens.length) {
        return null;
    }

    const p = state.position;
    state.position = Math.min(state.tokens.length - 1, state.position + n);
    return state.tokens[p];
}

function many(parse, state) {
    const results = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const x = parse(state);
        if (x === null) {
            return results;
        }

        results.push(x);
    }
}

function many1(parse, state) {
    const z = parse(state);
    if (z === null) {
        return null;
    }

    const results = many(parse, state);
    results.unshift(z);
    return results;
}

function binaryOp(table, parse, state) {
    const node1 = parse(state);
    const nodes = many1(s => {
        const op = oneOf(Object.keys(table), s);
        if (op === null) {
            return null;
        }

        const x = parse(state);
        if (x === null) {
            return null;
        }

        return [table[op.type], x];
    }, state);

    if (nodes === null) {
        return node1;
    }

    return nodes.reduce((lhs, [op, rhs]) => ({ type: 'Binary', lhs, op, rhs }), node1);
}

function oneOf(tokens, state) {
    for (const t of tokens) {
        if (peek(state) !== null && peek(state).type === t) {
            return next(state);
        }
    }

    return null;
}

function token(t, state) {
    if (peek(state) !== null && peek(state).type === t) {
        return next(state);
    }

    return null;
}

module.exports = {
    peek,
    location,
    next,
    many,
    many1,
    binaryOp,
    oneOf,
    token
};

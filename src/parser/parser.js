function peek(state) {
    if (state.position >= state.tokens.length) {
        return null;
    }

    return state.tokens[state.position];
}

function location(state) {
    return state.tokens[state.position].position;
}

function next(n, state) {
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
    const nodes = many1(() => {
        const op = oneOf(Object.keys(table), state);
        if (op === null) {
            return null;
        }

        const x = parse(state);
        if (x === null) {
            return null;
        }

        return [table[op.type], x];
    }, state);

    return [node1, nodes];
}

function oneOf(tokens, state) {
    for (const tok of tokens) {
        if (peek(state) !== null && peek(state).type === tok) {
            return next(1, state);
        }
    }

    return null;
}

function token(tok, state) {
    if (peek(state) !== null && peek(state).type === tok) {
        return next(1, state);
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

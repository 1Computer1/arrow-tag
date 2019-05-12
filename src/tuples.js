// Anything that has this symbol set to true is a tuple.
const isTuple = Symbol('isTuple');

function tuple(...args) {
    args[isTuple] = true;
    return args;
}

// Spreads values onto functions as long as they are tuples.
function spreadTuple(f, args) {
    const pass = [];
    for (const arg of args) {
        if (arg[isTuple]) {
            pass.push(...arg);
        } else {
            pass.push(arg);
        }
    }

    return f(...pass);
}

module.exports = { isTuple, tuple, spreadTuple };

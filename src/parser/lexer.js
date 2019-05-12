function makeToken(type, position, value) {
    return { type, position, value };
}

const lexemes = [
    [/^\s+/, null],
    [/^\d+/, 'Number'],
    [/^<\*>/, 'Sub'],
    [/^>>>/, 'Right3'],
    [/^<<</, 'Left3'],
    [/^\^\^\^/, 'Caret3'],
    [/^\*\*\*/, 'Star3'],
    [/^&&&/, 'And3'],
    [/^@/, 'At'],
    [/^\$/, 'Dollar'],
    [/^~/, 'Tilde'],
    [/^#/, 'Hash'],
    [/^\(/, 'Open'],
    [/^\)/, 'Close']
];

function lexString(initPosition, input) {
    const result = [];
    let position = 0;
    while (position < input.length) {
        findLexeme: {
            for (const [re, type] of lexemes) {
                const match = input.substring(position).match(re);
                if (match) {
                    if (type !== null) {
                        result.push(makeToken(type, initPosition + position, match[0]));
                    }

                    position += match[0].length;
                    break findLexeme;
                }
            }

            // No lexemes matched.
            throw new Error(`Unknown character ${input[position]} at position ${initPosition + position}`);
        }
    }

    return result;
}

function lex(raws, interps) {
    const tokens = [];
    let position = 0;
    for (let i = 0; i < raws.length - 1; i++) {
        tokens.push(...lexString(position, raws[i]));
        position += raws[i].length;
        tokens.push(makeToken('Interp', position, interps[i]));
    }

    tokens.push(...lexString(position, raws[raws.length - 1]));
    position += raws[raws.length - 1].length;
    tokens.push(makeToken('EOF', position, ''));
    return tokens;
}

module.exports = { lex };

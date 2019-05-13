function makeToken(type, position, value) {
    return { type, position, value };
}

function makeRule(type, regex, keep = true) {
    return { type, regex, keep };
}

const Lexemes = {
    Whitespace: 'Whitespace',
    Number: 'Number',
    StarOp: 'StarOp',
    CaretOp: 'CaretOp',
    RAngle3: 'RAngle3',
    LAngle3: 'LAngle3',
    Star3: 'Star3',
    Amp3: 'Amp3',
    At: 'At',
    Dollar: 'Dollar',
    Tilde: 'Tilde',
    Hash: 'Hash',
    LParen: 'LParen',
    RParen: 'RParen',
    EOF: 'EOF',
    Interp: 'Interp'
};

const lexemeRules = [
    makeRule(Lexemes.Whitespace, /^\s+/, false),
    makeRule(Lexemes.Number, /^\d+/),
    makeRule(Lexemes.StarOp, /^<\*>/),
    makeRule(Lexemes.CaretOp, /^<\^>/),
    makeRule(Lexemes.RAngle3, /^>>>/),
    makeRule(Lexemes.LAngle3, /^<<</),
    makeRule(Lexemes.Star3, /^\*\*\*/),
    makeRule(Lexemes.Amp3, /^&&&/),
    makeRule(Lexemes.At, /^@/),
    makeRule(Lexemes.Dollar, /^\$/),
    makeRule(Lexemes.Tilde, /^~/),
    makeRule(Lexemes.Hash, /^#/),
    makeRule(Lexemes.LParen, /^\(/),
    makeRule(Lexemes.RParen, /^\)/)
];

function lexString(initPosition, input) {
    const result = [];
    let position = 0;
    while (position < input.length) {
        findLexeme: {
            for (const { type, regex, keep } of lexemeRules) {
                const match = input.substring(position).match(regex);
                if (match) {
                    if (keep) {
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
        tokens.push(makeToken(Lexemes.Interp, position, interps[i]));
    }

    tokens.push(...lexString(position, raws[raws.length - 1]));
    position += raws[raws.length - 1].length;
    tokens.push(makeToken(Lexemes.EOF, position, ''));
    return tokens;
}

module.exports = { Lexemes, lex };

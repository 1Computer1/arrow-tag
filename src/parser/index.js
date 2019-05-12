const { parse } = require('./grammar');
const { lex } = require('./lexer');
const { evaluate } = require('./evaluator');

module.exports = { parse, lex, evaluate };

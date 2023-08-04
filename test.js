import { CharSeparator, Lexer } from "./lexer/Lexer.js";
import fs from "fs"
import sys from "os"


const data = fs.readFileSync("syntax.code", "utf-8")

// var tokens = new CharSeparator(data).charTokens
var lexer = new Lexer(data)
lexer.lex()
console.log(lexer.tokens)
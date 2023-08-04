import { isDeepStrictEqual } from "util";
import tokenLists from "./Tokens.js";


class CharSeparator {
    constructor(input) {
        this.input = input;
        this.charTokens = [];
        this.singleOperator = tokenLists.singleOperator;
        this.isInStringBlock = false
        // this.reserved = this.tokenLists.reserved;
        this.separate();
    }

    separate() {
        let line = 1;
        let col = 1;
        let token = {}

        for (let char of this.input.split("")) {
            for (let [tokenName, validation] of Object.entries(this.singleOperator)) {
                if (validation(char)) {
                    token = { type: tokenName, line: line, col: col, value: char }

                    if (token.type == "QUOTE") this.isInStringBlock = !this.isInStringBlock

                    if (token.type == "ILLEGALCHAR" && !this.isInStringBlock) {
                        console.error("Illegal character at line:" + line + ",col:" + col + ",value:" + char)
                    }
                    else {
                        this.charTokens.push(token)
                    }
                    break;
                }//if validation
            }//inner loop 
            if (char == "\n") {
                line++;
                col = 1
            }
            else {
                col++
            }
        }//outerloop
    }//separate
}//charSeparator


class Lexer {
    constructor(input) {
        this.charTokens = new CharSeparator(input).charTokens;
        this.tokens = []
        this.currentToken = {}
        this.openingBracket = 0;
        this.closingBracket = 0;
        this.index = 0;
        this.char = this.charTokens[this.index]
    }


    isPeakNext() {
        try {
            return this.charTokens[this.index + 1];
        }
        catch {
            return false;
        }
    }//isPeakNext
    next() {
        this.index++;
        this.char = this.charTokens[this.index]
    }

    handleString() {
        this.currentToken = {
            type: "STRING",
            line: this.char.line,
            col: this.char.col,
            value: ''
        }

        if (this.isPeakNext) {
            this.next();
        }
        else {
            console.error("EOF While parsing string at line:" + this.currentToken.line)
        }

        while (this.char.type != "QUOTE") {
            this.currentToken.value = this.currentToken.value.concat(this.char.value)
            this.next();
            if (!this.char) {
                console.error("EOF While parsing string at line:" + this.currentToken.line)
            }
        }//while
        this.tokens.push(this.currentToken)
        this.next();
    }//handleString


    handleNumber() {
        let isDecimal = false;
        this.currentToken = {
            type: "NUMBER",
            line: this.char.line,
            col: this.char.col,
            value: ''
        }

        while (this.char.type == "NUMBER" || (!isDecimal && this.char.type == "DOT" && this.isPeakNext() && this.isPeakNext.type == "NUMBER")) {
            if (this.char.type == "DOT") {
                isDecimal = true
            }
            this.currentToken.value = this.currentToken.value.concat(this.char.value)
            this.next()
        }//while
        this.tokens.push(this.currentToken)
        this.next()
    }

    handleIdentifier() {
        this.currentToken = {
            type: "IDENTIFIER",
            line: this.char.line,
            col: this.char.col,
            value: ''
        }
        while (this.char.type == "NUMBER" || this.char.type == "LETTER") {
            this.currentToken.value = this.currentToken.value.concat(this.char.value)
            this.next()
        }//while

        if (Object.keys(tokenLists.reserved).includes(this.currentToken.value)) {
            this.currentToken.type = tokenLists.reserved[this.currentToken.value]
        }

        this.tokens.push(this.currentToken)
        this.next()

    }//handleId

    isDoubleOperator() {
        if (!this.isPeakNext()) return false
        let chars = this.char.value.concat(this.isPeakNext().value)
        for (let [tokenName, validation] of Object.entries(tokenLists.multiOperator)) {
            if (validation(chars)) {
                return { type: tokenName, line: this.char.line, col: this.char.col, value: chars }
            }
        }
    }

    handleOperator() {
        if (this.char.type == "WHITESPACE") {
            this.next()
            return
        }
        let testDouble = this.isDoubleOperator()
        if (testDouble) {
            this.tokens.push(testDouble)
            this.next()
        }
        else {
            this.tokens.push(this.char)
        }
        this.next()

    }//handleOperator

    lex() {
        while (this.char) {
            switch (this.char.type) {
                case "QUOTE": this.handleString(); break;
                case "NUMBER": this.handleNumber(); break;
                case "LETTER": this.handleIdentifier(); break;
                default: this.handleOperator()
            }
        }//while
    }//lex
}


export { CharSeparator, Lexer }
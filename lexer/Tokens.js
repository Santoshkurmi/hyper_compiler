const tokenLists = {
    singleOperator: {
        "LPAREN": (input) => input == "(",
        "RPAREN": (input) => input == ")",
        "LCURLY": (input) => input == "{",
        "RCURLY": (input) => input == "}",
        "LSQUARE": (input) => input == "[",
        "RSQUARE": (input) => input == "]",
        "LETTER": (input) => /^[a-zA-Z]+$/.test(input),
        "NUMBER": (input) => /^[0-9]+$/.test(input),
        "QUOTE": (input) => input == "'",
        "SEMICOLON": (input) => input == ";",
        "EQUAL": (input) => input == "=",
        "GREATERTHAN": (input) => input == ">",
        "SMALLERTHAN": (input) => input == "<",
        "NOT": (input) => input == "!",
        "PLUS": (input) => input == "+",
        "COMMA": (input) => input == ",",
        "DOT": (input) => input == ".",
        "MINUS": (input) => input == "-",
        "DIVIDE": (input) => input == "/",
        "MUL": (input) => input == "*",
        "MODULO": (input) => input == "%",
        "WHITESPACE": (input) => !/\S/.test(input),
        "ILLEGALCHAR": (input) => true,
    },
    multiOperator: {
        "NOTEQUAL": (input) => input == "!=",
        "GREATERTHANEQUAL": (input) => input == ">=",
        "SMALLERTHANEQUAL": (input) => input == "<=",
    },
    reserved: {
        "while": "WHILE",
        "if": "IF",
        "else": "ELSE",
        "print": "PRINT",
    }
}

export default tokenLists;
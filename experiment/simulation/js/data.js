/****
  * File containing CFG examples and derivations
  *
  */

// CFG for balanced parentheses
const cfg1 = {
    "description": "Grammar for balanced parentheses",
    "startSymbol": "S",
    "productions": [
        "S → (S)",
        "S → SS",
        "S → ε"
    ],
    "inputs": [
        {
            "string": "()()",
            "derivations": [
                {
                    "description": "Leftmost derivation for ()()",
                    "steps": [
                        "S",
                        "SS",
                        "(S)S",
                        "()S",
                        "()(S)",
                        "()()"
                    ]
                },
                {
                    "description": "Alternative derivation",
                    "steps": [
                        "S",
                        "(S)",
                        "(SS)",
                        "(()S)",
                        "(()(S))",
                        "(()())"
                    ]
                }
            ]
        },
        {
            "string": "(())",
            "derivations": [
                {
                    "description": "Leftmost derivation for (())",
                    "steps": [
                        "S",
                        "(S)",
                        "((S))",
                        "(())"
                    ]
                }
            ]
        }
    ]
}

// CFG for arithmetic expressions
const cfg2 = {
    "description": "Grammar for simple arithmetic expressions",
    "startSymbol": "E",
    "productions": [
        "E → E + T",
        "E → T",
        "T → T * F",
        "T → F",
        "F → (E)",
        "F → id"
    ],
    "inputs": [
        {
            "string": "id+id*id",
            "derivations": [
                {
                    "description": "Standard derivation",
                    "steps": [
                        "E",
                        "E + T",
                        "T + T",
                        "F + T",
                        "id + T",
                        "id + T * F",
                        "id + F * F",
                        "id + id * F",
                        "id + id * id"
                    ]
                }
            ]
        },
        {
            "string": "(id+id)*id",
            "derivations": [
                {
                    "description": "Derivation with parentheses",
                    "steps": [
                        "E",
                        "T",
                        "T * F",
                        "F * F",
                        "(E) * F",
                        "(E + T) * F",
                        "(T + T) * F",
                        "(F + T) * F",
                        "(id + T) * F",
                        "(id + F) * F",
                        "(id + id) * F",
                        "(id + id) * id"
                    ]
                }
            ]
        }
    ]
}

const cfgs = [cfg1, cfg2];
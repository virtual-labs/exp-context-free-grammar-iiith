/****
  * CFG examples with rule tracking
  *
  */

// Helper function to create step objects
function step(result, rule) {
    return { result, rule };
}

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
                        step("S", "Start Symbol"),
                        step("SS", "S → SS"),
                        step("(S)S", "S → (S)"),
                        step("()S", "S → ε"),
                        step("()(S)", "S → (S)"),
                        step("()()", "S → ε")
                    ]
                }
            ]
        }
    ]
};

const cfg2 = {
    "description": "Grammar for string generation",
    "startSymbol": "S",
    "productions": [
        "S → aSb",
        "S → ab"
    ],
    "inputs": [
        {
            "string": "aabb",
            "derivations": [
                {
                    "description": "Derivation for 'aabb'",
                    "steps": [
                        step("S", "Start Symbol"),
                        step("aSb", "S → aSb"),
                        step("aaSbb", "S → aSb"),
                        step("aabb", "S → ab")
                    ]
                }
            ]
        }
    ]
};

const cfg3 = {
    "description": "Grammar for arithmetic expressions",
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
                        step("E", "Start Symbol"),
                        step("E + T", "E → E + T"),
                        step("T + T", "E → T"),
                        step("F + T", "T → F"),
                        step("id + T", "F → id"),
                        step("id + T * F", "T → T * F"),
                        step("id + F * F", "T → F"),
                        step("id + id * F", "F → id"),
                        step("id + id * id", "F → id")
                    ]
                }
            ]
        }
    ]
};

const cfgs = [cfg1, cfg2, cfg3];
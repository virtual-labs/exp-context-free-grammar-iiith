/**
 * Context-Free Grammar Derivation Visualization
 * 
 * This script handles the visualization of CFG derivations,
 * derivation trees, and input processing.
 */

// Helper functions for SVG and DOM manipulation
function newElementNS(tag, attr) {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
    attr.forEach(function (item) {
        elem.setAttribute(item[0], item[1]);
    });
    return elem;
}

function newElement(tag, attr) {
    const elem = document.createElement(tag);
    if (attr) {
        attr.forEach(function (item) {
            elem.setAttribute(item[0], item[1]);
        });
    }
    return elem;
}

function clearElem(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.lastChild);
    }
}

// Global variables to track current state
let currentCfgIndex = 0;
let currentInputIndex = 0;
let currentStepIndex = 0;

// Helper function for creating derivation steps
function step(result, rule) {
    return { result, rule };
}

// CFG Definitions with pre-calculated derivations
const cfgs = [
    {
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
            },
            {
                "string": "((()))",
                "derivations": [
                    {
                        "description": "Leftmost derivation for ((()))",
                        "steps": [
                            step("S", "Start Symbol"),
                            step("(S)", "S → (S)"),
                            step("((S))", "S → (S)"),
                            step("(((S)))", "S → (S)"),
                            step("((()))", "S → ε")
                        ]
                    }
                ]
            }
        ]
    },
    {
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
                        "description": "Leftmost derivation for aabb",
                        "steps": [
                            step("S", "Start Symbol"),
                            step("aSb", "S → aSb"),
                            step("aabb", "S → ab")
                        ]
                    }
                ]
            },
            {
                "string": "aaabbb",
                "derivations": [
                    {
                        "description": "Leftmost derivation for aaabbb",
                        "steps": [
                            step("S", "Start Symbol"),
                            step("aSb", "S → aSb"),
                            step("aaSbb", "S → aSb"),
                            step("aaabbb", "S → ab")
                        ]
                    }
                ]
            }
        ]
    },
    {
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
                "string": "id * id",
                "derivations": [
                    {
                        "description": "Standard derivation for id * id",
                        "steps": [
                            step("E", "Start Symbol"),
                            step("T", "E → T"),
                            step("T * F", "T → T * F"),
                            step("F * F", "T → F"),
                            step("id * F", "F → id"),
                            step("id * id", "F → id")
                        ]
                    }
                ]
            },
            {
                "string": "id + id",
                "derivations": [
                    {
                        "description": "Standard derivation for id + id",
                        "steps": [
                            step("E", "Start Symbol"),
                            step("E + T", "E → E + T"),
                            step("T + T", "E → T"),
                            step("F + T", "T → F"),
                            step("id + T", "F → id"),
                            step("id + F", "T → F"),
                            step("id + id", "F → id")
                        ]
                    }
                ]
            }
        ]
    }
];

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for buttons
    document.getElementById('change_grammar').addEventListener('click', changeGrammar);
    document.getElementById('change_input').addEventListener('click', changeInput);
    document.getElementById('next_step').addEventListener('click', nextStep);
    document.getElementById('prev_step').addEventListener('click', prevStep);
    
    // Initialize the view
    refreshDisplay();
    
    // Initialize parse tree builder
    window.parseTreeBuilder.initialize();
});

// Function to change the current grammar
function changeGrammar() {
    currentCfgIndex = (currentCfgIndex + 1) % cfgs.length;
    currentInputIndex = 0;
    currentStepIndex = 0;
    
    // Show notification
    showNotification('Grammar Changed', `Now showing: ${cfgs[currentCfgIndex].description}`);
    
    refreshDisplay();
    
    // Reinitialize parse tree builder with new grammar
    window.parseTreeBuilder.initialize();
}

// Function to change the current input string
function changeInput() {
    const currentCfg = cfgs[currentCfgIndex];
    currentInputIndex = (currentInputIndex + 1) % currentCfg.inputs.length;
    currentStepIndex = 0;
    
    // Show notification
    showNotification('Input Changed', 
      `New input: "${currentCfg.inputs[currentInputIndex].string}"`);
    
    refreshDisplay();
    
    // Reinitialize parse tree builder with new input
    window.parseTreeBuilder.initialize();
}

// Function to move to the next derivation step
// Function to show a hint (repurposed from nextStep)
function nextStep() {
    window.parseTreeBuilder.reset();
}

// Function to show a hint (repurposed from prevStep)
function prevStep() {
    swal({
        title: "Hint",
        text: "Look at the red nodes in the parse tree - these are non-terminals that can be expanded. Click on one and then choose the appropriate production rule.",
        icon: "info",
        button: "Got it!"
    });
}

// Function to update the entire display based on current state
function refreshDisplay() {
    const cfg = cfgs[currentCfgIndex];
    const input = cfg.inputs[currentInputIndex];
    const derivation = input.derivations[0];

    // Update grammar description
    const descContainer = document.getElementById("grammar_description_container");
    clearElem(descContainer);
    const desc = document.createElement('h3');
    desc.textContent = cfg.description;
    descContainer.appendChild(desc);

    // Update input string
    const inputContainer = document.getElementById("input_container");
    clearElem(inputContainer);
    const inputStr = document.createElement('div');
    inputStr.className = "input-string";
    inputStr.textContent = input.string;
    inputContainer.appendChild(inputStr);

    // Update production rules
    const rulesContainer = document.getElementById("production_rules_container");
    clearElem(rulesContainer);
    
    cfg.productions.forEach(prod => {
        const rule = document.createElement('div');
        rule.className = "rule";
        rule.textContent = prod;
        rulesContainer.appendChild(rule);
    });
    
    // Update derivation steps list
    updateDerivationStepsList(derivation);
}

// Function to update the derivation steps list
function updateDerivationStepsList(derivation) {
    const stepsList = document.getElementById("derivation_steps_list");
    clearElem(stepsList);
    
    for (let i = 0; i <= currentStepIndex && i < derivation.steps.length; i++) {
        const step = derivation.steps[i];
        const stepItem = document.createElement('li');
        stepItem.className = 'trace-item';
        
        if (i === currentStepIndex) {
            stepItem.classList.add('active');
        }
        
        const stepContent = document.createTextNode(step.result);
        stepItem.appendChild(stepContent);
        
        const ruleSpan = document.createElement('span');
        ruleSpan.className = 'rule-applied';
        ruleSpan.textContent = `[${step.rule}]`;
        stepItem.appendChild(ruleSpan);
        
        stepsList.appendChild(stepItem);
    }
}

// Note: drawDerivationTree function removed - replaced with interactive parse tree builder

// Function to show completion alert
function showCompletionAlert(inputString, finalDerivation) {
    const derivedString = finalDerivation.replace(/[A-Z]/g, '');
    const isCompleteDerivation = derivedString === inputString;

    swal({
        title: isCompleteDerivation ? "Success!" : "Derivation Complete",
        text: isCompleteDerivation
            ? "The Input String was successfully derived from the Grammar."
            : `The Derivation did not match the Input String.\n\nDerived: "${derivedString}"\nExpected: "${inputString}"`,
        icon: isCompleteDerivation ? "success" : "info",
        button: {
            text: "OK",
            className: isCompleteDerivation ? "swal-button--green" : "swal-button--blue"
        }
    });
}

// Function to show notifications
function showNotification(title, message, type = 'info') {
    // Using SweetAlert for notifications
    swal({
        title: title,
        text: message,
        icon: type,
        button: "OK",
    });
}

//Your JavaScript goes in here
/*****
 * File containing main logic for CFG derivation
 *
 */

let currentCfgIndex = 0;
let currentInputIndex = 0;
let currentDerivationIndex = 0;
let currentStepIndex = 0;

function refreshDisplay() {
    const cfg = cfgs[currentCfgIndex];
    const input = cfg.inputs[currentInputIndex];
    const derivation = input.derivations[currentDerivationIndex];

    // Update grammar description
    const descContainer = document.getElementById("grammar_description_container");
    clearElem(descContainer);
    const desc = newElement("div", [
        ["class", "is-size-4"],
        ["style", "margin-bottom: 20px;"]
    ]);
    desc.textContent = cfg.description;
    descContainer.appendChild(desc);

    // Update input string display
    const inputContainer = document.getElementById("input_container");
    clearElem(inputContainer);
    const inputStr = newElement("div", [
        ["class", "input-string"]
    ]);
    inputStr.textContent = input.string;
    inputContainer.appendChild(inputStr);

    // Update production rules
    const rulesContainer = document.getElementById("production_rules_container");
    displayProductionRules(rulesContainer, cfg.productions);

    // Update derivation tree
    const treeCanvas = document.getElementById("derivation_tree");
    drawDerivationTree(treeCanvas, derivation.steps[currentStepIndex]);

    // Update derivation steps list
    const stepsList = document.getElementById("derivation_steps_list");
    clearElem(stepsList);

    derivation.steps.forEach((step, index) => {
        const stepItem = newElement("li", [
            ["class", index === currentStepIndex ? "current-step" : ""]
        ]);
        stepItem.textContent = step;
        stepsList.appendChild(stepItem);
    });

    // Scroll to current step
    if (stepsList.children[currentStepIndex]) {
        stepsList.children[currentStepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function resetDerivation() {
    currentStepIndex = 0;
    currentDerivationIndex = 0;
    refreshDisplay();
}

window.addEventListener("load", function () {
    refreshDisplay();

    // Event listener for changing grammar
    document.getElementById("change_grammar").addEventListener("click", function () {
        currentCfgIndex = (currentCfgIndex + 1) % cfgs.length;
        currentInputIndex = 0;
        resetDerivation();
    });

    // Event listener for changing input
    document.getElementById("change_input").addEventListener("click", function () {
        const cfg = cfgs[currentCfgIndex];
        currentInputIndex = (currentInputIndex + 1) % cfg.inputs.length;
        resetDerivation();
    });

    // Event listener for next step
    document.getElementById("next").addEventListener("click", function () {
        const cfg = cfgs[currentCfgIndex];
        const input = cfg.inputs[currentInputIndex];
        const derivation = input.derivations[currentDerivationIndex];

        if (currentStepIndex < derivation.steps.length - 1) {
            currentStepIndex++;
            refreshDisplay();

            if (currentStepIndex === derivation.steps.length - 1) {
                swal("Derivation complete!", `The input string "${input.string}" can be derived from the grammar.`, "success");
            }
        }
    });

    // Event listener for previous step
    document.getElementById("prev").addEventListener("click", function () {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            refreshDisplay();
        }
    });
});
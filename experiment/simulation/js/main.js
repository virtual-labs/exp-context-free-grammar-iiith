/*****
 * Main CFG derivation logic
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
    desc.style.fontWeight = 'bold';
    descContainer.appendChild(desc);

    // Update input string
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
    drawDerivationTree(treeCanvas, derivation.steps[currentStepIndex].result);

    // Update derivation steps
    const stepsList = document.getElementById("derivation_steps_list");
    clearElem(stepsList);

    if (derivation.steps && derivation.steps.length > 0) {
        const fragment = document.createDocumentFragment();

        for (let i = currentStepIndex; i >= 0; i--) {
            const step = derivation.steps[i];
            const stepItem = newElement("li", [
                ["class", i === currentStepIndex ? "current-step" : ""]
            ]);

            const stepNumber = newElement("span", [["class", "step-number"]]);
            stepNumber.textContent = `Step ${i + 1}: `;

            const stepResult = newElement("span", [["class", "step-result"]]);
            stepResult.textContent = step.result;

            const stepRule = newElement("div", [["class", "step-rule"]]);
            stepRule.textContent = `Using: ${step.rule}`;

            stepItem.appendChild(stepNumber);
            stepItem.appendChild(stepResult);
            stepItem.appendChild(stepRule);
            fragment.appendChild(stepItem);
        }

        stepsList.appendChild(fragment);
    }

    // Show completion alert if we're at the final step
    if (currentStepIndex === derivation.steps.length - 1) {
        showCompletionAlert(input.string, derivation.steps[currentStepIndex].result);
    }
}

function showCompletionAlert(inputString, finalDerivation) {
    const derivedString = finalDerivation.replace(/[A-Z]/g, '');
    const isCompleteDerivation = derivedString === inputString;

    swal({
        text: isCompleteDerivation
            ? "The Input String was successfully derived from the Grammar."
            : `The Derivation did not match the Input String.\n\nDerived: "${derivedString}"\nExpected: "${inputString}"`,
        // icon: isCompleteDerivation ? "success" : "info",
        // button: "OK"
    });
}

function resetDerivation() {
    currentStepIndex = 0;
    currentDerivationIndex = 0;
    refreshDisplay();
}

window.addEventListener("load", function () {
    refreshDisplay();

    // Change Grammar button
    document.getElementById("change_grammar").addEventListener("click", function () {
        currentCfgIndex = (currentCfgIndex + 1) % cfgs.length;
        currentInputIndex = 0;
        resetDerivation();
    });

    // Change Input button
    document.getElementById("change_input").addEventListener("click", function () {
        const cfg = cfgs[currentCfgIndex];
        currentInputIndex = (currentInputIndex + 1) % cfg.inputs.length;
        currentDerivationIndex = 0;
        resetDerivation();
    });

    // Next Step button
    document.getElementById("next").addEventListener("click", function () {
        const cfg = cfgs[currentCfgIndex];
        const input = cfg.inputs[currentInputIndex];
        const derivation = input.derivations[currentDerivationIndex];

        if (currentStepIndex < derivation.steps.length - 1) {
            currentStepIndex++;
            refreshDisplay();
        }
    });

    // Previous Step button
    document.getElementById("prev").addEventListener("click", function () {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            refreshDisplay();
        }
    });
});
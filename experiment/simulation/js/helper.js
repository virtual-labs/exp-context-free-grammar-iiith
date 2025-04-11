/****
 * File containing helper functions for CFG visualization
 *
 */

function newElementNS(tag, attr) {
    elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
    attr.forEach(function (item) {
        elem.setAttribute(item[0], item[1]);
    });
    return elem;
}

function newElement(tag, attr) {
    elem = document.createElement(tag);
    attr.forEach(function (item) {
        elem.setAttribute(item[0], item[1]);
    });
    return elem;
}

function clearElem(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.lastChild);
    }
}

function drawDerivationTree(canvas, derivationStep, width = 600, height = 300) {
    clearElem(canvas);

    // This is a simplified tree drawing function
    // In a real implementation, you would use a proper tree layout algorithm
    const centerX = width / 2;
    const startY = 30;
    const levelHeight = 60;

    const symbols = derivationStep.split(/\s+/);
    const levels = Math.ceil(Math.log2(symbols.length + 1));

    // Draw nodes
    for (let i = 0; i < symbols.length; i++) {
        const level = Math.floor(Math.log2(i + 1));
        const posInLevel = i + 1 - Math.pow(2, level);
        const x = centerX + (posInLevel - (Math.pow(2, level) - 1) / 2) * (width / (Math.pow(2, level) + 1));
        const y = startY + level * levelHeight;

        // Draw node
        const circle = newElementNS("circle", [
            ["cx", x],
            ["cy", y],
            ["r", 20],
            ["fill", "#29e"],
            ["stroke", "#fff"],
            ["stroke-width", "2"]
        ]);
        canvas.appendChild(circle);

        // Draw text
        const text = newElementNS("text", [
            ["x", x],
            ["y", y + 5],
            ["text-anchor", "middle"],
            ["fill", "#fff"],
            ["font-size", "14px"],
            ["font-family", "sans-serif"]
        ]);
        text.textContent = symbols[i];
        canvas.appendChild(text);

        // Draw connection to parent if not root
        if (i > 0) {
            const parentIdx = Math.floor((i - 1) / 2);
            const parentLevel = Math.floor(Math.log2(parentIdx + 1));
            const parentPosInLevel = parentIdx + 1 - Math.pow(2, parentLevel);
            const parentX = centerX + (parentPosInLevel - (Math.pow(2, parentLevel) - 1) / 2) * (width / (Math.pow(2, parentLevel) + 1));
            const parentY = startY + parentLevel * levelHeight;

            const line = newElementNS("line", [
                ["x1", parentX],
                ["y1", parentY + 20],
                ["x2", x],
                ["y2", y - 20],
                ["stroke", "#ccc"],
                ["stroke-width", "2"]
            ]);
            canvas.appendChild(line);
        }
    }
}

function displayProductionRules(container, productions) {
    clearElem(container);

    const title = newElement("h3", [
        ["class", "is-size-5"],
        ["style", "margin-bottom: 10px;"]
    ]);
    title.textContent = "Production Rules:";
    container.appendChild(title);

    const rulesDiv = newElement("div", [
        ["class", "bg-muted p-4 rounded-md font-mono space-y-1"]
    ]);

    productions.forEach(rule => {
        const ruleElem = newElement("div", [
            ["class", "production-rule"]
        ]);
        ruleElem.textContent = rule;
        rulesDiv.appendChild(ruleElem);
    });

    container.appendChild(rulesDiv);
}
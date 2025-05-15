/****
 * Helper functions for CFG visualization
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

    const symbols = derivationStep.split(/\s+/);
    const centerX = width / 2;
    const startY = 30;
    const levelHeight = 80; // Increased for better spacing
    const baseRadius = 20;
    const charWidth = 7; // Approximate width per character
    const padding = 8;

    // Calculate node positions and sizes
    const nodes = symbols.map((symbol, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const posInLevel = i + 1 - Math.pow(2, level);
        const x = centerX + (posInLevel - (Math.pow(2, level) - 1) / 2) * (width / (Math.pow(2, level) + 1));
        const y = startY + level * levelHeight;
        const radius = Math.max(baseRadius, (symbol.length * charWidth) / 2 + padding);

        return { x, y, radius, symbol };
    });

    // Draw connections first (so nodes appear on top)
    nodes.forEach((node
        , i) => {
        if (i > 0) {
            const parent = nodes[Math.floor((i - 1) / 2)];
            const line = newElementNS("line", [
                ["x1", parent.x],
                ["y1", parent.y + parent.radius],
                ["x2", node.x],
                ["y2", node.y - node.radius],
                ["stroke", "#ccc"],
                ["stroke-width", "2"]
            ]);
            canvas.appendChild(line);
        }
    });

    // Draw nodes
    nodes.forEach(node => {
        const circle = newElementNS("circle", [
            ["cx", node.x],
            ["cy", node.y],
            ["r", node.radius],
            ["fill", "#29e"],
            ["stroke", "#fff"],
            ["stroke-width", "2"],
            ["class", "tree-node"]
        ]);
        canvas.appendChild(circle);

        const text = newElementNS("text", [
            ["x", node.x],
            ["y", node.y + 5],
            ["text-anchor", "middle"],
            ["fill", "#fff"],
            ["font-size", "14px"],
            ["font-family", "monospace"],
            ["class", "tree-node-text"]
        ]);
        text.textContent = node.symbol;
        canvas.appendChild(text);
    });
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
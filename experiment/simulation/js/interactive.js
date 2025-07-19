/**
 * Interactive Parse Tree Builder
 * Allows users to build parse trees by selecting production rules
 */

// Parse tree state
let parseTree = null;
let selectedNode = null;
let targetString = "";
let derivationSteps = []; // Track user's steps

// Parse tree node structure
class TreeNode {
    constructor(symbol, x = 0, y = 0) {
        this.symbol = symbol;
        this.children = [];
        this.parent = null;
        this.x = x;
        this.y = y;
        this.id = Math.random().toString(36).substr(2, 9);
        this.isTerminal = this.isTerminalSymbol(symbol);
        this.isExpanded = false;
    }
    
    isTerminalSymbol(symbol) {
        // Terminal symbols are lowercase, operators, parentheses, or epsilon
        return /^[a-z()+*ε]$/.test(symbol) || symbol === 'id';
    }
    
    addChild(symbol) {
        const child = new TreeNode(symbol);
        child.parent = this;
        this.children.push(child);
        this.isExpanded = true;
        return child;
    }
    
    getLeaves() {
        if (this.children.length === 0) {
            return [this];
        }
        
        let leaves = [];
        for (let child of this.children) {
            leaves = leaves.concat(child.getLeaves());
        }
        return leaves;
    }
    
    getDerivedString() {
        const leaves = this.getLeaves();
        return leaves.map(leaf => leaf.symbol === 'ε' ? '' : leaf.symbol).join('');
    }
}

/**
 * Get partial derived string showing current state of derivation
 */
function getPartialDerivedString() {
    if (!parseTree) return "";
    
    const leaves = parseTree.getLeaves();
    return leaves.map(leaf => {
        if (leaf.symbol === 'ε') return '';
        return leaf.symbol;
    }).join('');
}

/**
 * Initialize the interactive parse tree builder
 */
function initializeParseTreeBuilder() {
    const currentCfg = cfgs[currentCfgIndex];
    const currentInput = currentCfg.inputs[currentInputIndex];
    targetString = currentInput.string;
    
    // Update target string display
    document.getElementById('target_string').textContent = targetString;
    
    // Initialize parse tree with start symbol at proper position
    parseTree = new TreeNode(currentCfg.startSymbol);
    parseTree.x = 200; // Center horizontally
    parseTree.y = 60;  // Start from top
    selectedNode = null;
    derivationSteps = []; // Clear derivation steps
    
    // Create production rule buttons
    updateRuleButtons();
    
    // Draw initial tree
    drawParseTree();
    
    // Initialize derivation steps display
    updateDerivationStepsDisplay();
}

/**
 * Update production rule buttons
 */
function updateRuleButtons() {
    // Update the main production rules display
    const productionRulesContainer = document.getElementById('production_rules_container');
    if (productionRulesContainer) {
        productionRulesContainer.innerHTML = '';
        
        const currentCfg = cfgs[currentCfgIndex];
        currentCfg.productions.forEach(rule => {
            const button = document.createElement('button');
            button.className = 'rule-button';
            button.textContent = rule;
            button.addEventListener('click', () => applyProductionRule(rule));
            
            // Disable button if no non-terminal is selected or rule doesn't apply
            if (!selectedNode || selectedNode.isTerminal || selectedNode.isExpanded) {
                button.disabled = true;
            } else {
                // Check if this rule can be applied to the selected node
                const ruleParts = rule.split('→');
                const leftSide = ruleParts[0].trim();
                if (leftSide !== selectedNode.symbol) {
                    button.disabled = true;
                }
            }
            
            productionRulesContainer.appendChild(button);
        });
    }
}

/**
 * Apply a production rule to the selected node
 */
function applyProductionRule(rule) {
    if (!selectedNode || selectedNode.isTerminal || selectedNode.isExpanded) {
        return;
    }
    
    const ruleParts = rule.split('→');
    const leftSide = ruleParts[0].trim();
    const rightSide = ruleParts[1].trim();
    
    // Check if rule applies to selected node
    if (leftSide !== selectedNode.symbol) {
        return;
    }
    
    // Apply the rule
    if (rightSide === 'ε') {
        // Epsilon production
        selectedNode.addChild('ε');
    } else {
        // Split right side into symbols
        const symbols = parseRightSide(rightSide);
        symbols.forEach(symbol => {
            selectedNode.addChild(symbol);
        });
    }
    
    // Log the step taken by user
    const currentDerived = parseTree.getDerivedString();
    const stepResult = currentDerived || getPartialDerivedString();
    derivationSteps.push({
        rule: rule,
        result: stepResult
    });
    updateDerivationStepsDisplay();
    
    // Update tree
    calculateNodePositions();
    drawParseTree();
    
    // Clear selection
    selectedNode = null;
    updateRuleButtons();
    
    // Check if tree is complete
    checkTreeCompletion();
}

/**
 * Parse the right side of a production rule into individual symbols
 */
function parseRightSide(rightSide) {
    const symbols = [];
    let i = 0;
    
    while (i < rightSide.length) {
        if (rightSide.substr(i, 2) === 'id') {
            symbols.push('id');
            i += 2;
        } else if (rightSide[i] === ' ') {
            i++;
        } else {
            symbols.push(rightSide[i]);
            i++;
        }
    }
    
    return symbols;
}

/**
 * Calculate positions for all nodes in the tree
 */
function calculateNodePositions() {
    if (!parseTree) return;
    
    // Get all leaves to determine width
    const leaves = parseTree.getLeaves();
    const leafCount = Math.max(leaves.length, 1);
    const minSpacing = 80;
    const totalWidth = leafCount * minSpacing;
    const startX = 50; // Left margin
    
    // Position leaves horizontally
    leaves.forEach((leaf, index) => {
        leaf.x = startX + (index * minSpacing) + (minSpacing / 2);
    });
    
    // Set root position
    parseTree.x = startX + (totalWidth / 2);
    parseTree.y = 60; // Top margin
    
    // Position all nodes from root down
    positionInternalNodes(parseTree);
}

/**
 * Position internal nodes based on their children
 */
function positionInternalNodes(node) {
    if (node.children.length === 0) {
        // Leaf node - set Y position based on depth from root
        const depth = getDepthFromRoot(node);
        node.y = 60 + depth * 70; // Start at 60px, 70px spacing between levels
        return;
    }
    
    // Position children first
    node.children.forEach(child => positionInternalNodes(child));
    
    // Position this node at the center of its children
    const childXPositions = node.children.map(child => child.x);
    node.x = (Math.min(...childXPositions) + Math.max(...childXPositions)) / 2;
    
    // Set Y position based on depth from root (not from leaf)
    const depth = getDepthFromRoot(node);
    node.y = 60 + depth * 70; // Start at 60px, 70px spacing between levels
}

/**
 * Get the depth of a node from the root (0 for root, 1 for children, etc.)
 */
function getDepthFromRoot(node) {
    let depth = 0;
    let current = node;
    while (current.parent) {
        depth++;
        current = current.parent;
    }
    return depth;
}

/**
 * Draw the parse tree
 */
function drawParseTree() {
    const svg = document.getElementById('parse_tree_svg');
    clearElem(svg);
    
    if (!parseTree) return;
    
    // Calculate positions
    calculateNodePositions();
    
    // Calculate proper viewBox to fit the tree
    const leaves = parseTree.getLeaves();
    const leafCount = Math.max(leaves.length, 1);
    const maxDepth = getMaxDepth(parseTree);
    
    // Dynamic sizing based on tree size
    const treeWidth = Math.max(400, leafCount * 80 + 100); // 100px for margins
    const treeHeight = Math.max(300, (maxDepth + 1) * 70 + 120); // 120px for top/bottom margins
    
    svg.setAttribute('viewBox', `0 0 ${treeWidth} ${treeHeight}`);
    
    // Draw edges first (so they appear behind nodes)
    drawEdges(svg, parseTree);
    
    // Draw nodes on top
    drawNodes(svg, parseTree);
}

/**
 * Get maximum depth of the tree from root
 */
function getMaxDepth(node) {
    if (node.children.length === 0) {
        return getDepthFromRoot(node);
    }
    
    let maxDepth = getDepthFromRoot(node);
    node.children.forEach(child => {
        maxDepth = Math.max(maxDepth, getMaxDepth(child));
    });
    
    return maxDepth;
}

/**
 * Draw edges between nodes
 */
function drawEdges(svg, node) {
    node.children.forEach(child => {
        const line = newElementNS('line', [
            ['x1', node.x],
            ['y1', node.y + 20],
            ['x2', child.x],
            ['y2', child.y - 20],
            ['stroke', '#6B7280'],
            ['stroke-width', '2']
        ]);
        svg.appendChild(line);
        
        // Recursively draw edges for children
        drawEdges(svg, child);
    });
}

/**
 * Draw nodes
 */
function drawNodes(svg, node) {
    // Determine node appearance
    let fillColor, strokeColor, textColor;
    
    if (node.isTerminal) {
        fillColor = '#F3F4F6';
        strokeColor = '#6B7280';
        textColor = '#1F2937';
    } else if (node.isExpanded) {
        fillColor = '#DBEAFE';
        strokeColor = '#3B82F6';
        textColor = '#1E40AF';
    } else {
        fillColor = '#FEF2F2';
        strokeColor = '#EF4444';
        textColor = '#DC2626';
    }
    
    // Highlight selected node
    if (node === selectedNode) {
        fillColor = '#FEF3C7';
        strokeColor = '#F59E0B';
        textColor = '#92400E';
    }
    
    // Create node circle
    const circle = newElementNS('circle', [
        ['cx', node.x],
        ['cy', node.y],
        ['r', '25'],
        ['fill', fillColor],
        ['stroke', strokeColor],
        ['stroke-width', '2'],
        ['class', 'tree-node'],
        ['data-node-id', node.id]
    ]);
    
    // Add click event for non-terminal, non-expanded nodes
    if (!node.isTerminal && !node.isExpanded) {
        circle.style.cursor = 'pointer';
        circle.addEventListener('click', () => selectNode(node));
    }
    
    svg.appendChild(circle);
    
    // Add text label
    const text = newElementNS('text', [
        ['x', node.x],
        ['y', node.y],
        ['text-anchor', 'middle'],
        ['dy', '0.3em'],
        ['fill', textColor],
        ['font-size', '14px'],
        ['font-weight', '600'],
        ['pointer-events', 'none']
    ]);
    text.textContent = node.symbol;
    svg.appendChild(text);
    
    // Recursively draw children
    node.children.forEach(child => drawNodes(svg, child));
}

/**
 * Select a node for expansion
 */
function selectNode(node) {
    selectedNode = node;
    updateRuleButtons();
    drawParseTree(); // Redraw to highlight selection
}

/**
 * Update instruction text
 */
/**
 * Find nodes that can be expanded
 */
function findExpandableNodes() {
    if (!parseTree) return [];
    
    const expandableNodes = [];
    
    function traverse(node) {
        if (!node.isTerminal && !node.isExpanded) {
            expandableNodes.push(node);
        }
        node.children.forEach(child => traverse(child));
    }
    
    traverse(parseTree);
    return expandableNodes;
}

/**
 * Check if tree construction is complete or if there's an incorrect derivation
 */
function checkTreeCompletion() {
    if (!parseTree) return;
    
    const expandableNodes = findExpandableNodes();
    const derivedString = parseTree.getDerivedString();
    
    // Check if all leaf nodes are terminals
    const leaves = parseTree.getLeaves();
    const allTerminals = leaves.every(leaf => leaf.isTerminal);
    
    if (allTerminals && derivedString !== targetString) {
        // All terminals but wrong string - incorrect derivation
        swal({
            title: "Incorrect Derivation!",
            text: `The parse tree only has terminals but the derived string "${derivedString}" doesn't match the target "${targetString}". The tree will be reset.`,
            icon: "error",
            button: "OK"
        }).then(() => {
            resetParseTree();
        });
        return;
    }
    
    if (expandableNodes.length === 0) {
        if (derivedString === targetString) {
            setTimeout(() => {
                swal({
                    title: "Success!",
                    text: `You successfully built a parse tree that derives "${targetString}"!`,
                    icon: "success",
                    button: {
                        text: "Great!",
                        className: "swal-button--green"
                    }
                });
            }, 1500);
        }
    }
}

/**
 * Reset the parse tree
 */
function resetParseTree() {
    const currentCfg = cfgs[currentCfgIndex];
    parseTree = new TreeNode(currentCfg.startSymbol);
    parseTree.x = 200; // Center horizontally
    parseTree.y = 60;  // Start from top
    selectedNode = null;
    derivationSteps = []; // Clear derivation steps
    updateRuleButtons();
    drawParseTree();
    updateDerivationStepsDisplay();
}

/**
 * Update the derivation steps display
 */
function updateDerivationStepsDisplay() {
    const stepsList = document.getElementById("derivation_steps_list");
    if (!stepsList) return;
    
    clearElem(stepsList);
    
    // Add initial step (start symbol)
    if (parseTree) {
        const startItem = document.createElement('li');
        startItem.className = 'trace-item';
        startItem.textContent = parseTree.symbol;
        stepsList.appendChild(startItem);
    }
    
    // Add each derivation step with proper format: "result (rule used)"
    derivationSteps.forEach((step, index) => {
        const stepItem = document.createElement('li');
        stepItem.className = 'trace-item';
        stepItem.textContent = `${step.result} (${step.rule})`;
        stepsList.appendChild(stepItem);
    });
}

/**
 * Show feedback message
 */
// Export functions for use in main script
window.parseTreeBuilder = {
    initialize: initializeParseTreeBuilder,
    reset: resetParseTree
};

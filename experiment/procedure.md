# Procedure

## Getting Started

The simulation interface consists of three main components:

1. **Grammar Control Panel**: Contains buttons to change grammars, input strings, and manage the derivation process
2. **Parse Tree Visualization**: An interactive visual representation of the derivation tree being constructed
3. **Derivation Steps Panel**: Shows the step-by-step derivation sequence as you build the parse tree

## Step-by-Step Instructions

### 1. Selecting a Grammar

Click the **"Change Grammar"** button to cycle through the three available grammars. Each grammar has a description explaining the language it generates. The current grammar's description is displayed above the parse tree, along with its production rules.

### 2. Choosing Input Strings

Click the **"Change Input"** button to cycle through different pre-configured target strings for the current grammar. Each grammar comes with multiple example strings that can be generated using the production rules.

### 3. Understanding the Interface

- **Start Symbol**: The root node of the parse tree, typically labeled with the grammar's start symbol
- **Non-terminal Nodes**: Displayed in red when they can be expanded further
- **Terminal Nodes**: Displayed in blue when they represent final symbols
- **Target String**: Shows the string you need to generate through the derivation
- **Production Rules**: Interactive buttons that apply specific grammar rules

### 4. Building Parse Trees Interactively

#### Selecting Nodes for Expansion

- **Red nodes** indicate non-terminal symbols that can be expanded
- **Click on a red node** to select it for expansion
- **Selected nodes** are highlighted to show which node will be expanded next

#### Applying Production Rules

After selecting a node:

- **Production rule buttons** appear below the parse tree
- **Click on a production rule button** to apply that rule to the selected node
- The selected node will expand according to the chosen production rule
- New child nodes are automatically created and positioned in the tree

### 5. Managing the Derivation Process

#### Reset Tree

Click the **"Reset Tree"** button to return the parse tree to its initial state with only the start symbol.

#### Show Hint

Click the **"Show Hint"** button to receive guidance on the next appropriate step in the derivation process.

#### Derivation Steps Tracking

The right panel automatically tracks each step of your derivation:

- Shows the current string form at each step
- Displays which production rule was applied
- Highlights the most recent step in the derivation

### 6. Understanding Results

Continue expanding non-terminal nodes until no red nodes remain. The derived string (reading the leaves from left to right) should match the target string to complete the derivation successfully.
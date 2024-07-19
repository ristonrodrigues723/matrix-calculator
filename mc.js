const matrixLetters = ['A', 'B', 'C'];
const matrices = {};

function initializeMatrixInputs() {
    const container = document.getElementById('matrixInputs');
    matrixLetters.forEach(letter => {
        const div = document.createElement('div');
        div.className = 'matrix-input';
        div.innerHTML = `
            <h3>Matrix ${letter}</h3>
            <label>Rows: <input type="number" id="rows_${letter}" min="1" max="5" value="2"></label>
            <label>Columns: <input type="number" id="cols_${letter}" min="1" max="5" value="2"></label>
            <button onclick="createMatrixGrid('${letter}')">Create Matrix</button>
            <div id="matrix_${letter}"></div>
        `;
        container.appendChild(div);
    });
    const identityDiv = document.createElement('div');
    identityDiv.innerHTML = `
        <h3>Identity Matrix</h3>
        <button onclick="addIdentityMatrix(2)">Add 2x2 Identity</button>
        <button onclick="addIdentityMatrix(3)">Add 3x3 Identity</button>
    `;
    container.appendChild(identityDiv);
}

function createMatrixGrid(letter) {
    const rows = parseInt(document.getElementById(`rows_${letter}`).value);
    const cols = parseInt(document.getElementById(`cols_${letter}`).value);
    const matrixDiv = document.getElementById(`matrix_${letter}`);
    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows * cols; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = '0';
        grid.appendChild(input);
    }
    
    matrixDiv.innerHTML = '';
    matrixDiv.appendChild(grid);
    
    // Add animation
    grid.style.animation = 'fadeIn 0.5s';
}

function getMatrixValues(letter) {
    const inputs = document.querySelectorAll(`#matrix_${letter} input`);
    return Array.from(inputs).map(input => parseFloat(input.value));
}



// identitiy
function createIdentityMatrix(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            matrix.push(i === j ? 1 : 0);
        }
    }
    return matrix;
}
// add
function addIdentityMatrix(size) {
    const equation = document.getElementById('equation');
    const identitySymbol = size === 2 ? 'I2' : 'I3';
    equation.value += (equation.value ? ' + ' : '') + identitySymbol;
    matrices[identitySymbol] = createIdentityMatrix(size);
}

function calculateResult() {
    const equation = document.getElementById('equation').value;
    matrixLetters.forEach(letter => {
        if (equation.includes(letter)) {
            matrices[letter] = getMatrixValues(letter);
        }
    });
    
    // Add identity matrices if they're in the equation
    if (equation.includes('I2')) {
        matrices['I2'] = createIdentityMatrix(2);
    }
    if (equation.includes('I3')) {
        matrices['I3'] = createIdentityMatrix(3);
    }

    try {
        const result = evaluateEquation(equation);
        displayResult(result);
    } catch (error) {
        document.getElementById('result').textContent = 'Error: ' + error.message;
    }
}

function evaluateEquation(equation) {
    const tokens = equation.match(/[A-C]|I[23]|\+|\*|-/g);
    let result = null;
    let currentOp = '+';
    

    const calculationSteps = document.getElementById('calculationSteps');
    calculationSteps.innerHTML = '';

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token in matrices) {
            const matrix = matrices[token];
            if (!result) {
                result = matrix;
                displayStep(calculationSteps, `Step 1: Start with Matrix ${token}`, matrix);
            } else {
                switch (currentOp) {
                    case '+': 
                        result = addMatrices(result, matrix); 
                        displayStep(calculationSteps, `Step ${i}: Add Matrix ${token}`, result);
                        break;
                    case '-': 
                        result = subtractMatrices(result, matrix); 
                        displayStep(calculationSteps, `Step ${i}: Subtract Matrix ${token}`, result);
                        break;
                    case '*': 
                        result = multiplyMatrices(result, matrix); 
                        displayStep(calculationSteps, `Step ${i}: Multiply by Matrix ${token}`, result);
                        break;
                }
            }
        } else if (['+', '-', '*'].includes(token)) {
            currentOp = token;
        }
    }

    return result;
}

function displayStep(container, stepText, matrix) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'calculation-step';
    stepDiv.innerHTML = `<h4>${stepText}</h4>`;
    const matrixDiv = createMatrixDisplay(matrix);
    stepDiv.appendChild(matrixDiv);
    container.appendChild(stepDiv);
    
    // Add animation
    stepDiv.style.animation = 'slideIn 0.5s';
}

function createMatrixDisplay(matrix) {
    const size = Math.sqrt(matrix.length);
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-grid';
    matrixDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    matrix.forEach(val => {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = val;
        input.readOnly = true;
        matrixDiv.appendChild(input);
    });
    return matrixDiv;
}

function addMatrices(a, b) {
    return a.map((val, i) => val + b[i]);
}

function subtractMatrices(a, b) {
    return a.map((val, i) => val - b[i]);
}

function multiplyMatrices(a, b) {
    const rowsA = Math.sqrt(a.length);
    const colsA = rowsA;
    const rowsB = Math.sqrt(b.length);
    const colsB = rowsB;

    if (colsA !== rowsB) {
        throw new Error('Matrices cannot be multiplied');
    }

    let result = [];
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += a[i * colsA + k] * b[k * colsB + j];
            }
            result.push(sum);
        }
    }
    return result;
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    const size = Math.sqrt(result.length);
    let html = '<h3>Result:</h3><div class="matrix-grid" style="grid-template-columns: repeat(' + size + ', 1fr);">';
    result.forEach(val => {
        html += `<input type="number" value="${val}" readonly>`;
    });
    html += '</div>';
    resultDiv.innerHTML = html;
}

initializeMatrixInputs();
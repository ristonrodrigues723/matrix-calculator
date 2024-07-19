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
            <button onclick="addInverseMatrix('${letter}')">Add Inverse</button>
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

    // Add inversion button
    const inversionDiv = document.createElement('div');
    inversionDiv.innerHTML = `
        <h3>Matrix Inversion</h3>
        <button onclick="addInversionFunction()">Add inv()</button>
    `;
    container.appendChild(inversionDiv);
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
// 
function calculateDeterminant(matrix) {
    const size = Math.sqrt(matrix.length);
    if (size === 2) {
        return matrix[0] * matrix[3] - matrix[1] * matrix[2];
    } else if (size === 3) {
        return matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) -
               matrix[1] * (matrix[3] * matrix[8] - matrix[5] * matrix[6]) +
               matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6]);
    }
    throw new Error('Inverse calculation is only supported for 2x2 and 3x3 matrices');
}

// Add this function to calculate the inverse of a matrix
function calculateInverse(matrix) {
    const size = Math.sqrt(matrix.length);
    const det = calculateDeterminant(matrix);
    
    if (Math.abs(det) < 1e-6) {
        throw new Error('Matrix is not invertible');
    }

    if (size === 2) {
        return [
            matrix[3] / det, -matrix[1] / det,
            -matrix[2] / det, matrix[0] / det
        ];
    } else if (size === 3) {
        const inv = [];
        inv[0] = (matrix[4] * matrix[8] - matrix[5] * matrix[7]) / det;
        inv[1] = (matrix[2] * matrix[7] - matrix[1] * matrix[8]) / det;
        inv[2] = (matrix[1] * matrix[5] - matrix[2] * matrix[4]) / det;
        inv[3] = (matrix[5] * matrix[6] - matrix[3] * matrix[8]) / det;
        inv[4] = (matrix[0] * matrix[8] - matrix[2] * matrix[6]) / det;
        inv[5] = (matrix[2] * matrix[3] - matrix[0] * matrix[5]) / det;
        inv[6] = (matrix[3] * matrix[7] - matrix[4] * matrix[6]) / det;
        inv[7] = (matrix[1] * matrix[6] - matrix[0] * matrix[7]) / det;
        inv[8] = (matrix[0] * matrix[4] - matrix[1] * matrix[3]) / det;
        return inv;
    }
    throw new Error('Inverse calculation is only supported for 2x2 and 3x3 matrices');
}
function addInverseMatrix(letter) {
    const equation = document.getElementById('equation');
    equation.value += (equation.value ? ' + ' : '') + `inv(${letter})`;
}


function calculateResult() {
    const equation = document.getElementById('equation').value;
    matrixLetters.forEach(letter => {
        if (equation.includes(letter)) {
            matrices[letter] = getMatrixValues(letter);
        }
    });

    try {
        const result = evaluateEquation(equation);
        displayResult(result);
    } catch (error) {
        document.getElementById('result').textContent = 'Error: ' + error.message;
    }
}

function addInvertedMatrix(letter) {
    const matrix = getMatrixValues(letter);
    const size = Math.sqrt(matrix.length);
    if (size !== 2 && size !== 3) {
        alert('Only 2x2 and 3x3 matrices can be inverted');
        return;
    }
    
    try {
        const inverted = invertMatrix(matrix);
        const invertedSymbol = `inv(${letter})`;
        matrices[invertedSymbol] = inverted;
        
        const equation = document.getElementById('equation');
        equation.value += (equation.value ? ' * ' : '') + invertedSymbol;
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
function addInversionFunction() {
    const equation = document.getElementById('equation');
    equation.value += (equation.value ? ' * ' : '') + 'inv()';
    // Move cursor inside parentheses
    equation.setSelectionRange(equation.value.length - 1, equation.value.length - 1);
    equation.focus();
}

function evaluateEquation(equation) {
    const tokens = equation.match(/[A-C]|I[23]|\+|\*|-|inv\([A-C]\)/g);
    let result = null;
    let currentOp = '+';

    const calculationSteps = document.getElementById('calculationSteps');
    calculationSteps.innerHTML = '';

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token in matrices) {
            // ... (existing code for regular matrices)
        } else if (token.startsWith('inv(')) {
            const matrixLetter = token.charAt(4);
            const matrix = matrices[matrixLetter];
            const inverseMatrix = calculateInverse(matrix);
            if (!result) {
                result = inverseMatrix;
                displayStep(calculationSteps, `Step ${i + 1}: Start with Inverse of Matrix ${matrixLetter}`, inverseMatrix);
            } else {
                switch (currentOp) {
                    case '+': 
                        result = addMatrices(result, inverseMatrix);
                        displayStep(calculationSteps, `Step ${i + 1}: Add Inverse of Matrix ${matrixLetter}`, result);
                        break;
                    case '-': 
                        result = subtractMatrices(result, inverseMatrix);
                        displayStep(calculationSteps, `Step ${i + 1}: Subtract Inverse of Matrix ${matrixLetter}`, result);
                        break;
                    case '*': 
                        result = multiplyMatrices(result, inverseMatrix);
                        displayStep(calculationSteps, `Step ${i + 1}: Multiply by Inverse of Matrix ${matrixLetter}`, result);
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

initializeMatrixInputs();
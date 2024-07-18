const matrixLetters = ['A', 'B', 'C', 'D', 'E'];
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
}

function getMatrixValues(letter) {
    const inputs = document.querySelectorAll(`#matrix_${letter} input`);
    return Array.from(inputs).map(input => parseFloat(input.value));
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

function evaluateEquation(equation) {
    const tokens = equation.match(/[A-E]|\+|\*|-/g);
    let result = null;
    let currentOp = '+';

    for (let token of tokens) {
        if (token in matrices) {
            const matrix = matrices[token];
            if (!result) {
                result = matrix;
            } else {
                switch (currentOp) {
                    case '+': result = addMatrices(result, matrix); break;
                    case '-': result = subtractMatrices(result, matrix); break;
                    case '*': result = multiplyMatrices(result, matrix); break;
                }
            }
        } else if (['+', '-', '*'].includes(token)) {
            currentOp = token;
        }
    }

    return result;
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
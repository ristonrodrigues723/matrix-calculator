const matrixLetters = ['A', 'B', 'C'];
const matrices = {};

// Keep all the existing functions (initializeMatrixInputs, createMatrixGrid, getMatrixValues) unchanged

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
    const tokens = equation.match(/[A-C]|inv\([A-C]\)|\+|\*|-/g);
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
                result = performOperation(result, matrix, currentOp, i + 1, token);
            }
        } else if (token.startsWith('inv(') && token.endsWith(')')) {
            const matrixLetter = token.charAt(4);
            const matrix = matrices[matrixLetter];
            const inverseMatrix = calculateInverse(matrix);
            if (!result) {
                result = inverseMatrix;
                displayStep(calculationSteps, `Step 1: Start with Inverse of Matrix ${matrixLetter}`, inverseMatrix);
            } else {
                result = performOperation(result, inverseMatrix, currentOp, i + 1, `inv(${matrixLetter})`);
            }
        } else if (['+', '-', '*'].includes(token)) {
            currentOp = token;
        }
    }

    return result;
}

function performOperation(result, matrix, op, step, matrixName) {
    switch (op) {
        case '+': 
            result = addMatrices(result, matrix); 
            displayStep(calculationSteps, `Step ${step}: Add Matrix ${matrixName}`, result);
            break;
        case '-': 
            result = subtractMatrices(result, matrix); 
            displayStep(calculationSteps, `Step ${step}: Subtract Matrix ${matrixName}`, result);
            break;
        case '*': 
            result = multiplyMatrices(result, matrix); 
            displayStep(calculationSteps, `Step ${step}: Multiply by Matrix ${matrixName}`, result);
            break;
    }
    return result;
}

function calculateInverse(matrix) {
    const size = Math.sqrt(matrix.length);
    if (size !== 2 && size !== 3) {
        throw new Error('Inverse calculation is only supported for 2x2 and 3x3 matrices');
    }

    const det = calculateDeterminant(matrix, size);
    if (det === 0) {
        throw new Error('Matrix is not invertible (determinant is zero)');
    }

    if (size === 2) {
        return [
            matrix[3] / det, -matrix[1] / det,
            -matrix[2] / det, matrix[0] / det
        ];
    } else { // 3x3 matrix
        const cofactors = calculateCofactors(matrix);
        const adjugate = transposeMatrix(cofactors);
        return adjugate.map(val => val / det);
    }
}

function calculateDeterminant(matrix, size) {
    if (size === 2) {
        return matrix[0] * matrix[3] - matrix[1] * matrix[2];
    } else { // 3x3 matrix
        return matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) -
               matrix[1] * (matrix[3] * matrix[8] - matrix[5] * matrix[6]) +
               matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6]);
    }
}

function calculateCofactors(matrix) {
    return [
        +(matrix[4] * matrix[8] - matrix[5] * matrix[7]),
        -(matrix[3] * matrix[8] - matrix[5] * matrix[6]),
        +(matrix[3] * matrix[7] - matrix[4] * matrix[6]),
        -(matrix[1] * matrix[8] - matrix[2] * matrix[7]),
        +(matrix[0] * matrix[8] - matrix[2] * matrix[6]),
        -(matrix[0] * matrix[7] - matrix[1] * matrix[6]),
        +(matrix[1] * matrix[5] - matrix[2] * matrix[4]),
        -(matrix[0] * matrix[5] - matrix[2] * matrix[3]),
        +(matrix[0] * matrix[4] - matrix[1] * matrix[3])
    ];
}

function transposeMatrix(matrix) {
    const size = Math.sqrt(matrix.length);
    let result = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            result.push(matrix[j * size + i]);
        }
    }
    return result;
}

// Keep the existing addMatrices, subtractMatrices, multiplyMatrices, displayResult functions

initializeMatrixInputs();
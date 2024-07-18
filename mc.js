let matrixCount = 0;
let operationCount = 0;

function addMatrix() {
    matrixCount++;
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-input';
    matrixDiv.innerHTML = `
        <h3>Matrix ${matrixCount}</h3>
        <div class="matrix" id="matrix${matrixCount}">
            <input type="number" value="0">
            <input type="number" value="0">
            <input type="number" value="0">
            <input type="number" value="0">
        </div>
    `;
    document.getElementById('matricesContainer').appendChild(matrixDiv);
    updateOperationSelects();
}

function addOperation() {
    operationCount++;
    const opDiv = document.createElement('div');
    opDiv.innerHTML = `
        <select id="matrix1_${operationCount}">
            ${generateMatrixOptions()}
        </select>
        <select id="operation_${operationCount}">
            <option value="add">+</option>
            <option value="multiply">×</option>
        </select>
        <select id="matrix2_${operationCount}">
            ${generateMatrixOptions()}
        </select>
    `;
    document.getElementById('operationsContainer').appendChild(opDiv);
}

function generateMatrixOptions() {
    let options = '';
    for (let i = 1; i <= matrixCount; i++) {
        options += `<option value="${i}">Matrix ${i}</option>`;
    }
    return options;
}

function updateOperationSelects() {
    const selects = document.querySelectorAll('#operationsContainer select');
    selects.forEach(select => {
        if (select.id.startsWith('matrix')) {
            const currentValue = select.value;
            select.innerHTML = generateMatrixOptions();
            if (currentValue <= matrixCount) {
                select.value = currentValue;
            }
        }
    });
}

function getMatrixValues(matrixId) {
    const inputs = document.querySelectorAll(`#${matrixId} input`);
    return Array.from(inputs).map(input => parseFloat(input.value));
}

function addMatrices(matrix1, matrix2) {
    return matrix1.map((value, index) => value + matrix2[index]);
}

function multiplyMatrices(matrix1, matrix2) {
    return [
        matrix1[0] * matrix2[0] + matrix1[1] * matrix2[2],
        matrix1[0] * matrix2[1] + matrix1[1] * matrix2[3],
        matrix1[2] * matrix2[0] + matrix1[3] * matrix2[2],
        matrix1[2] * matrix2[1] + matrix1[3] * matrix2[3]
    ];
}

function calculateResult() {
    if (matrixCount === 0 || operationCount === 0) {
        alert("Please add at least one matrix and one operation.");
        return;
    }

    let result = null;
    for (let i = 1; i <= operationCount; i++) {
        const matrix1Index = document.getElementById(`matrix1_${i}`).value;
        const matrix2Index = document.getElementById(`matrix2_${i}`).value;
        const operation = document.getElementById(`operation_${i}`).value;

        const matrix1 = getMatrixValues(`matrix${matrix1Index}`);
        const matrix2 = getMatrixValues(`matrix${matrix2Index}`);

        const operationResult = operation === 'add' ? addMatrices(matrix1, matrix2) : multiplyMatrices(matrix1, matrix2);

        result = result ? (operation === 'add' ? addMatrices(result, operationResult) : multiplyMatrices(result, operationResult)) : operationResult;
    }

    displayResult(result);
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Result:<br>${result[0]} ${result[1]}<br>${result[2]} ${result[3]}`;
}

// Add the first matrix and operation by default
addMatrix();

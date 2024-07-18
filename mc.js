function getMatrixValues(matrixId) {
    const inputs = document.querySelectorAll(`#${matrixId} input`);
    return Array.from(inputs).map(input => parseFloat(input.value));
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Result:<br>${result[0]} ${result[1]}<br>${result[2]} ${result[3]}`;
}

function addMatrices() {
    const matrixA = getMatrixValues('matrixA');
    const matrixB = getMatrixValues('matrixB');
    const result = matrixA.map((value, index) => value + matrixB[index]);
    displayResult(result);
}

function multiplyMatrices() {
    const matrixA = getMatrixValues('matrixA');
    const matrixB = getMatrixValues('matrixB');
    const result = [
        matrixA[0] * matrixB[0] + matrixA[1] * matrixB[2],
        matrixA[0] * matrixB[1] + matrixA[1] * matrixB[3],
        matrixA[2] * matrixB[0] + matrixA[3] * matrixB[2],
        matrixA[2] * matrixB[1] + matrixA[3] * matrixB[3]
    ];
    displayResult(result);
}
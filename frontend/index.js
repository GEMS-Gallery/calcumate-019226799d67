import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.value = currentInput;
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentInput = digit;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        performCalculation(inputValue);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

async function performCalculation(secondOperand) {
    let result;

    switch (operator) {
        case '+':
            result = await backend.add(firstOperand, secondOperand);
            break;
        case '-':
            result = await backend.subtract(firstOperand, secondOperand);
            break;
        case '*':
            result = await backend.multiply(firstOperand, secondOperand);
            break;
        case '/':
            if (secondOperand === 0) {
                result = 'Error';
            } else {
                const divisionResult = await backend.divide(firstOperand, secondOperand);
                result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
            }
            break;
        default:
            return;
    }

    currentInput = result.toString();
    firstOperand = result;
    updateDisplay();
}

function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Event listeners
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => inputDigit(button.textContent));
});

document.querySelector('.decimal').addEventListener('click', inputDecimal);

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => handleOperator(button.textContent));
});

document.querySelector('.equals').addEventListener('click', () => {
    if (operator && !waitingForSecondOperand) {
        performCalculation(parseFloat(currentInput));
        operator = null;
    }
});

document.querySelector('.clear').addEventListener('click', resetCalculator);

// Initialize display
updateDisplay();

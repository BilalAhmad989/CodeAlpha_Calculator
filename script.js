// ---------- 1. Get the elements from the page ----------
const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");
const buttonsEl = document.getElementById("buttons");

// ---------- 2. Variables that remember the calculator's state ----------
let current = "0";          // the number being typed right now
let previous = "";          // the first number (saved when you press an operator)
let operator = null;        // the chosen operator: + − × ÷
let startNewNumber = false; // true when the next digit should begin a fresh number

// ---------- 3. Show the values on the screen ----------
function updateDisplay() {
  currentEl.textContent = current;
  previousEl.textContent = operator ? previous + " " + operator : "";
}

// ---------- 4. Typing a number or a decimal point ----------
function appendNumber(digit) {
  if (startNewNumber) {
    current = digit === "." ? "0." : digit;
    startNewNumber = false;
  } else {
    if (digit === "." && current.includes(".")) return; // only one dot allowed
    if (current === "0" && digit !== ".") {
      current = digit;           // replace the starting 0
    } else {
      current += digit;          // add the digit at the end
    }
  }
  updateDisplay();
}

// ---------- 5. Choosing an operator (+ − × ÷) ----------
function chooseOperator(op) {
  // If we already have "5 +" and a second number, calculate first (so 5 + 3 + 2 works)
  if (operator !== null && !startNewNumber) {
    calculate();
  }
  operator = op;
  previous = current;
  startNewNumber = true;
  updateDisplay();
}

// ---------- 6. Doing the maths ----------
function calculate() {
  if (operator === null || startNewNumber) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "−":
      result = a - b;
      break;
    case "×":
      result = a * b;
      break;
    case "÷":
      if (b === 0) {
        current = "Cannot divide by 0";
        operator = null;
        previous = "";
        startNewNumber = true;
        return;
      }
      result = a / b;
      break;
  }

  // Round to avoid 0.1 + 0.2 = 0.30000000000000004
  current = String(Math.round(result * 1e10) / 1e10);
  operator = null;
  previous = "";
  startNewNumber = true;
}

// ---------- 7. Pressing "=" ----------
function equals() {
  if (operator === null || startNewNumber) return;
  const expression = previous + " " + operator + " " + current + " =";
  calculate();
  updateDisplay();
  previousEl.textContent = expression;   // show the full sum above the answer
}

// ---------- 8. Clear everything (AC) ----------
function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  startNewNumber = false;
  updateDisplay();
}

// ---------- 9. Delete the last digit (DEL) ----------
function deleteLast() {
  if (startNewNumber) return;
  current = current.slice(0, -1);
  if (current === "" || current === "-") current = "0";
  updateDisplay();
}

// ---------- 10. Mouse / touch clicks on the buttons ----------
buttonsEl.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    appendNumber(button.dataset.number);
  } else if (button.dataset.operator !== undefined) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "equals") {
    equals();
  } else if (button.dataset.action === "clear") {
    clearAll();
  } else if (button.dataset.action === "delete") {
    deleteLast();
  }
});

// ---------- 11. Keyboard support (bonus) ----------
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    appendNumber(key);
  } else if (key === ".") {
    appendNumber(".");
  } else if (key === "+") {
    chooseOperator("+");
  } else if (key === "-") {
    chooseOperator("−");
  } else if (key === "*") {
    chooseOperator("×");
  } else if (key === "/") {
    event.preventDefault();       // stops the browser's quick-find from opening
    chooseOperator("÷");
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    equals();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});

// Show the starting value when the page loads
updateDisplay();
/* eslint-disable no-console */
/* global process */
// ==============================================================================
// BATERIA DE TESTES LÓGICOS DA CALCULADORA BRASIL
// Executável no terminal via Node.js: `node test-logic.js`
// ==============================================================================

const MathPI = Math.PI;

// 1. Funções matemáticas idênticas ao app.js (versão melhorada para exibição de decimais)
function precise(n) {
  if (!isFinite(n)) {
    return n;
  }
  return parseFloat(n.toPrecision(12));
}

function formatValue(n) {
  if (n === 'Erro') {
    return 'Erro';
  }
  const val = typeof n === 'string' ? parseFloat(n) : n;
  if (isNaN(val)) {
    return '0';
  }
  
  // Usar notação científica para números gigantescos ou minúsculos
  if (Math.abs(val) >= 1e12 || (Math.abs(val) > 0 && Math.abs(val) < 1e-7)) {
    return val.toExponential(5);
  }
  
  let s = precise(val).toString();
  if (s.length > 12) {
    if (s.includes('.')) {
      const parts = s.split('.');
      const integerLen = parts[0].length;
      const allowedDecimals = 12 - integerLen - 1;
      if (allowedDecimals > 0) {
        s = val.toFixed(allowedDecimals);
        // Remove zeros à direita após o ponto decimal
        s = parseFloat(s).toString();
      } else {
        s = val.toExponential(5);
      }
    } else {
      s = val.toExponential(5);
    }
  }
  return s;
}

function evaluate(expr) {
  let formattedExpr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, MathPI.toString());

  while (formattedExpr.includes('√')) {
    const match = formattedExpr.match(/√\(([^()]+)\)/);
    if (match) {
      const valueInside = evaluate(match[1]);
      if (valueInside === 'Erro' || parseFloat(valueInside) < 0) {
        return 'Erro';
      }
      formattedExpr = formattedExpr.replace(match[0], Math.sqrt(parseFloat(valueInside)).toString());
    } else {
      const matchSimple = formattedExpr.match(/√([0-9.]+)/);
      if (matchSimple) {
        const val = parseFloat(matchSimple[1]);
        if (val < 0) {
          return 'Erro';
        }
        formattedExpr = formattedExpr.replace(matchSimple[0], Math.sqrt(val).toString());
      } else {
        break;
      }
    }
  }

  const tokens = [];
  let numberBuffer = '';

  for (let i = 0; i < formattedExpr.length; i++) {
    const char = formattedExpr[i];
    if (char === ' ') {
      continue;
    }

    if (/[0-9.]/.test(char)) {
      numberBuffer += char;
    } else {
      if (numberBuffer) {
        tokens.push(parseFloat(numberBuffer));
        numberBuffer = '';
      }

      if (char === '-' && (tokens.length === 0 || ['+', '-', '*', '/', '^', '('].includes(tokens[tokens.length - 1]))) {
        numberBuffer = '-';
      } else {
        tokens.push(char);
      }
    }
  }

  if (numberBuffer) {
    tokens.push(parseFloat(numberBuffer));
  }

  const values = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

  function applyOp() {
    const op = operators.pop();
    const b = values.pop();
    const a = values.pop();

    if (a === undefined || b === undefined) {
      return false;
    }

    let res;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/':
        if (b === 0) {
          return false;
        }
        res = a / b;
        break;
      case '^': res = Math.pow(a, b); break;
      default: return false;
    }
    values.push(precise(res));
    return true;
  }

  try {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (typeof token === 'number') {
        values.push(token);
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          if (!applyOp()) {
            return 'Erro';
          }
        }
        operators.pop();
      } else if (['+', '-', '*', '/', '^'].includes(token)) {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          if (!applyOp()) {
            return 'Erro';
          }
        }
        operators.push(token);
      }
    }

    while (operators.length) {
      if (operators[operators.length - 1] === '(') {
        return 'Erro';
      }
      if (!applyOp()) {
        return 'Erro';
      }
    }

    if (values.length !== 1) {
      return 'Erro';
    }
    return formatValue(values[0]);
  } catch {
    return 'Erro';
  }
}

// 2. Casos de Teste Estruturados (com expectativas para a nova formatação limpa)
const testCases = [
  // Operações básicas
  { expr: "5 + 3", expected: "8" },
  { expr: "10 − 4", expected: "6" },
  { expr: "4 × 3", expected: "12" },
  { expr: "20 ÷ 5", expected: "4" },
  
  // Decimais e Precisão
  { expr: "0.1 + 0.2", expected: "0.3" },
  { expr: "1 ÷ 3", expected: "0.3333333333" },
  
  // Precedência de operadores
  { expr: "2 + 3 × 4", expected: "14" },
  { expr: "2 × 3 + 4", expected: "10" },
  { expr: "10 − 2 ÷ 2", expected: "9" },
  { expr: "2 ^ 3 + 4", expected: "12" },

  // Parênteses
  { expr: "( 2 + 3 ) × 4", expected: "20" },
  { expr: "2 × ( 3 + 4 )", expected: "14" },
  { expr: "( 10 − 2 ) ÷ ( 2 + 2 )", expected: "2" },
  { expr: "2 ^ ( 3 + 1 )", expected: "16" },
  
  // Operações Científicas (Raiz e Potência)
  { expr: "√( 9 )", expected: "3" },
  { expr: "√9", expected: "3" },
  { expr: "3 ^ 2", expected: "9" },
  { expr: "√( 2 + 7 )", expected: "3" },
  
  // Valores Negativos
  { expr: "-5 + 3", expected: "-2" },
  { expr: "5 + -3", expected: "2" },
  { expr: "-2 × -3", expected: "6" },
  
  // Constante PI
  { expr: "π", expected: "3.1415926536" },
  { expr: "2 × π", expected: "6.2831853072" },
  
  // Tratamento de Erros e Limites
  { expr: "5 ÷ 0", expected: "Erro" },
  { expr: "√( -4 )", expected: "Erro" },
  { expr: "( 2 + 3", expected: "Erro" },
];

// Execução e Relatório
console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", " INICIANDO TESTES LÓGICOS DA CALCULADORA BRASIL ");
console.log("\x1b[36m%s\x1b[0m", "==================================================");

let passedCount = 0;
const failures = [];

testCases.forEach((tc, idx) => {
  const result = evaluate(tc.expr);
  const status = result === tc.expected;
  
  if (status) {
    passedCount++;
    console.log(`\x1b[32m[OK] Teste #${idx + 1}: "${tc.expr}" = ${result}\x1b[0m`);
  } else {
    failures.push({ idx: idx + 1, expr: tc.expr, expected: tc.expected, got: result });
    console.log(`\x1b[31m[FALHA] Teste #${idx + 1}: "${tc.expr}" | Esperava: ${tc.expected} | Obteve: ${result}\x1b[0m`);
  }
});

console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", "               RESUMO DOS RESULTADOS              ");
console.log("\x1b[36m%s\x1b[0m", "==================================================");

const total = testCases.length;
if (passedCount === total) {
  console.log(`\x1b[32m✔ TODOS OS ${total} TESTES PASSARAM COM SUCESSO!\x1b[0m\n`);
  process.exit(0);
} else {
  console.log(`\x1b[31m❌ FALHA: ${failures.length} de ${total} testes falharam.\x1b[0m`);
  failures.forEach(f => {
    console.log(`   -> Teste #${f.idx}: "${f.expr}" | Esperado: ${f.expected} | Obtido: ${f.got}`);
  });
  console.log("");
  process.exit(1);
}

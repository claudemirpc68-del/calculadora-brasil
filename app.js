(function () {
  'use strict';

  // Elementos do DOM
  const numDisplay = document.getElementById('num');
  const exprDisplay = document.getElementById('expr');
  const calcContainer = document.getElementById('calc-container');
  const historyPanel = document.getElementById('history-panel');
  const historyList = document.getElementById('history-list');

  // Estado da calculadora
  let currentInput = '0';      // Valor exibido atualmente
  let currentExpression = '';  // Expressão matemática sendo construída
  let isNewCalculation = false; // Flag para indicar se o próximo dígito limpa a tela
  let history = [];            // Histórico de cálculos

  // Carregar histórico do LocalStorage ao inicializar
  try {
    const savedHistory = localStorage.getItem('calc_brasil_history');
    if (savedHistory) {
      history = JSON.parse(savedHistory);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Erro ao carregar o histórico:', e);
  }

  // Limitar dígitos de precisão
  function precise(n) {
    if (!isFinite(n)) {
      return n;
    }
    return parseFloat(n.toPrecision(12));
  }

  // Formatar número para exibição
  function formatValue(n) {
    if (n === 'Erro') {
      return 'Erro';
    }
    const val = typeof n === 'string' ? parseFloat(n) : n;
    if (isNaN(val)) {
      return '0';
    }
    const p = precise(val);
    let s = p.toString();
    if (s.length > 12) {
      s = p.toExponential(5);
    }
    return s;
  }

  // Atualizar visualização do display principal
  function updateDisplay(val) {
    currentInput = String(val);
    numDisplay.textContent = formatValue(val);
  }

  // Parser matemático seguro (Shunting-yard Algorithm)
  function evaluate(expr) {
    // Substituir símbolos visuais por operadores reais
    let formattedExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, Math.PI.toString());

    // Tratar raiz quadrada: sqrt(X) -> Math.sqrt(X)
    // Usaremos expressões regulares para avaliar raízes quadradas de forma segura
    while (formattedExpr.includes('√')) {
      const match = formattedExpr.match(/√\(([^()]+)\)/);
      if (match) {
        const valueInside = evaluate(match[1]);
        if (valueInside === 'Erro' || parseFloat(valueInside) < 0) {
          return 'Erro';
        }
        formattedExpr = formattedExpr.replace(match[0], Math.sqrt(parseFloat(valueInside)).toString());
      } else {
        // Se for um número solto depois de √ sem parênteses, ex: √9
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

    // Tokenizar a expressão
    const tokens = [];
    let numberBuffer = '';

    for (let i = 0; i < formattedExpr.length; i++) {
      const char = formattedExpr[i];

      // Ignorar espaços em branco
      if (char === ' ') {
        continue;
      }

      // Detectar números, incluindo decimais e suporte a números negativos se precedidos por operador
      if (/[0-9.]/.test(char)) {
        numberBuffer += char;
      } else {
        if (numberBuffer) {
          tokens.push(parseFloat(numberBuffer));
          numberBuffer = '';
        }

        // Tratar sinal de menos unário (negativo)
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

    // Pilhas para operadores e valores
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
          operators.pop(); // Remove '('
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
          return 'Erro'; // Parênteses desbalanceados
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

  // Adicionar item ao histórico
  function addToHistory(expr, result) {
    if (result === 'Erro') {
      return;
    }
    history.unshift({ expr, result });
    if (history.length > 50) {
      history.pop();
    }
    try {
      localStorage.setItem('calc_brasil_history', JSON.stringify(history));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao salvar no LocalStorage:', e);
    }
    renderHistory();
  }

  // Renderizar o histórico na tela
  function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">Nenhum cálculo recente</div>';
      return;
    }

    history.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.dataset.index = index;
      div.innerHTML = `
        <div class="hist-expr">${item.expr}</div>
        <div class="hist-result">${item.result}</div>
      `;
      historyList.appendChild(div);
    });
  }

  // Função para processar os cliques nos botões
  function handleInput(val) {
    if (val === 'AC') {
      currentInput = '0';
      currentExpression = '';
      exprDisplay.textContent = '';
      updateDisplay('0');
      isNewCalculation = false;
      return;
    }

    if (val === 'DEL' || val === '⌫') {
      if (currentInput === 'Erro' || isNewCalculation) {
        updateDisplay('0');
        return;
      }
      if (currentInput.length > 1) {
        updateDisplay(currentInput.slice(0, -1));
      } else {
        updateDisplay('0');
      }
      return;
    }

    if (val === '+/-') {
      if (currentInput !== 'Erro' && currentInput !== '0') {
        const numVal = parseFloat(currentInput) * -1;
        updateDisplay(formatValue(numVal));
      }
      return;
    }

    if (val === '%') {
      if (currentInput === 'Erro') {
        return;
      }
      const numVal = parseFloat(currentInput) / 100;
      updateDisplay(formatValue(numVal));
      return;
    }

    if (val === 'sqrt' || val === '√') {
      if (currentInput === 'Erro') {
        return;
      }
      const numVal = parseFloat(currentInput);
      if (numVal < 0) {
        updateDisplay('Erro');
        return;
      }
      const res = precise(Math.sqrt(numVal));
      updateDisplay(formatValue(res));
      isNewCalculation = true;
      return;
    }

    if (val === 'x²') {
      if (currentInput === 'Erro') {
        return;
      }
      const numVal = parseFloat(currentInput);
      const res = precise(Math.pow(numVal, 2));
      updateDisplay(formatValue(res));
      isNewCalculation = true;
      return;
    }

    if (val === 'π') {
      updateDisplay(precise(Math.PI).toString());
      isNewCalculation = false;
      return;
    }

    if (val === '.') {
      if (isNewCalculation) {
        updateDisplay('0.');
        isNewCalculation = false;
        return;
      }
      if (!currentInput.includes('.')) {
        updateDisplay(currentInput + '.');
      }
      return;
    }

    // Teclas numéricas
    if ('0123456789'.includes(val)) {
      if (isNewCalculation || currentInput === '0' || currentInput === 'Erro') {
        updateDisplay(val);
        isNewCalculation = false;
      } else if (currentInput.replace(/[^0-9]/g, '').length < 11) {
        updateDisplay(currentInput + val);
      }
      return;
    }

    // Operadores básicos e parênteses
    if (['+', '−', '×', '÷', '^', '(', ')'].includes(val)) {
      // Se for operador e o input atual tiver um número, concatena na expressão
      if (currentExpression === '' || isNewCalculation) {
        currentExpression = currentInput + ' ' + val + ' ';
      } else {
        currentExpression += currentInput + ' ' + val + ' ';
      }
      exprDisplay.textContent = currentExpression;
      isNewCalculation = true;
      return;
    }

    // Tecla de Igual (=)
    if (val === '=') {
      let finalExpr;
      if (currentExpression === '') {
        return; // Nada a avaliar
      } else {
        finalExpr = currentExpression + currentInput;
      }

      // Garantir parênteses balanceados antes de calcular
      const openCount = (finalExpr.match(/\(/g) || []).length;
      let closeCount = (finalExpr.match(/\)/g) || []).length;
      while (openCount > closeCount) {
        finalExpr += ' )';
        closeCount++;
      }

      const result = evaluate(finalExpr);
      exprDisplay.textContent = finalExpr + ' =';
      updateDisplay(result);
      
      // Registrar no histórico se não houve erro
      if (result !== 'Erro') {
        addToHistory(finalExpr, result);
      }
      
      currentExpression = '';
      isNewCalculation = true;
    }
  }

  // Configurar eventos do teclado e botões
  document.addEventListener('DOMContentLoaded', () => {
    const keysGrid = document.getElementById('keys');
    const scientificGrid = document.getElementById('scientific-keys');
    const toggleSciBtn = document.getElementById('toggle-sci');
    const toggleHistBtn = document.getElementById('toggle-hist');
    const closeHistBtn = document.getElementById('close-hist');
    const clearHistBtn = document.getElementById('clear-hist');

    // Event listener para teclas básicas
    if (keysGrid) {
      keysGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) {
          return;
        }
        handleInput(btn.dataset.v);
      });
    }

    // Event listener para teclas científicas
    if (scientificGrid) {
      scientificGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) {
          return;
        }
        handleInput(btn.dataset.v);
      });
    }

    // Alternar modo científico
    if (toggleSciBtn) {
      toggleSciBtn.addEventListener('click', () => {
        calcContainer.classList.toggle('scientific');
        // Alternar ícone/texto de dica
        if (calcContainer.classList.contains('scientific')) {
          toggleSciBtn.innerHTML = '⚙️'; // Científica ativa
        } else {
          toggleSciBtn.innerHTML = '🧪';
        }
      });
    }

    // Controlar histórico
    if (toggleHistBtn) {
      toggleHistBtn.addEventListener('click', () => {
        renderHistory();
        historyPanel.classList.add('open');
      });
    }

    if (closeHistBtn) {
      closeHistBtn.addEventListener('click', () => {
        historyPanel.classList.remove('open');
      });
    }

    if (clearHistBtn) {
      clearHistBtn.addEventListener('click', () => {
        history = [];
        try {
          localStorage.removeItem('calc_brasil_history');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        renderHistory();
      });
    }

    // Carregar valor do histórico de volta ao display
    if (historyList) {
      historyList.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (!item) {
          return;
        }
        const index = parseInt(item.dataset.index);
        if (!isNaN(index) && history[index]) {
          updateDisplay(history[index].result);
          exprDisplay.textContent = history[index].expr;
          currentExpression = '';
          isNewCalculation = true;
          historyPanel.classList.remove('open');
        }
      });
    }

    // Suporte ao Teclado Físico
    document.addEventListener('keydown', (e) => {
      const map = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '−', '*': '×', '/': '÷',
        'Enter': '=', '=': '=', '.': '.', ',': '.',
        'Escape': 'AC', '%': '%', 'Backspace': 'DEL',
        '^': '^', '(': '(', ')': ')'
      };
      
      const action = map[e.key];
      if (action) {
        e.preventDefault();
        
        // Efeito visual rápido no botão correspondente para dar feedback tátil
        const btn = document.querySelector(`[data-v="${action}"]`);
        if (btn) {
          btn.style.transform = 'scale(0.95)';
          btn.style.filter = 'brightness(1.2)';
          setTimeout(() => {
            btn.style.transform = '';
            btn.style.filter = '';
          }, 100);
        }
        
        handleInput(action);
      }
    });

    // Renderização inicial
    renderHistory();
  });
})();

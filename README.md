# 🇧🇷 Calculadora Brasil

Uma calculadora web desenvolvida do zero com design **3D Premium** inspirado nas cores da Seleção Brasileira! Botões com efeito de **alto-relevo (Neumorfismo)** que reagem ao clique como uma calculadora física real.

---

## 🎨 Preview

![Calculadora Brasil](https://claudemirpc68-del.github.io/calculadora-brasil/)

## 🚀 Demo ao vivo

👉 **[Clique aqui para testar a calculadora](https://claudemirpc68-del.github.io/calculadora-brasil/)**

---

## ✨ Funcionalidades

### 🎮 Calculadora Padrão
- ➕ Adição, ➖ Subtração, ✖️ Multiplicação e ➗ Divisão.
- 🔢 Suporte a números decimais de alta precisão.
- ➕➖ Inversão de sinal (`+/-`).
- 💯 Cálculo de porcentagem (`%`).
- ⌫ Botão visual de retrocesso (Backspace/DEL) para correções rápidas.
- ❌ Divisão por zero tratada com mensagem de `Erro`.
- ⌨️ **Suporte completo ao teclado** (números, operadores, Enter, Backspace, Escape).

### 🧪 Modo Científico / Avançado
*   Suporte a parênteses `( )` com balanceamento automático ao calcular.
*   Multiplicação implícita ao abrir parênteses (ex: `5(` vira `5 × ( `).
*   Raiz quadrada (`√`) e Exponenciação (`x²` e `x^y`).
*   Constante Matemática `π` (PI) de alta precisão.

### ⏳ Histórico de Cálculos
*   Painel lateral/superior deslizante que registra suas últimas 50 operações.
*   Persistência automática no navegador usando `LocalStorage`.
*   Clique em qualquer cálculo do histórico para trazê-lo de volta à tela principal.

---

## 🎨 Design

| Elemento | Escolha |
|---|---|
| **Tema** | Cores da Seleção Brasileira Noturna 🇧🇷 |
| **Estilo** | Glassmorphism translúcido com blur de fundo |
| **Bordas** | Dourado ouro translúcido com brilho interno |
| **Tela de display** | Azul vibrante com sombra neon |
| **Tipografia** | Google Fonts — Inter |
| **Animação** | Botões metálicos dinâmicos com transições de escala suave |

---

## 🧪 Bateria de Testes

O projeto inclui uma suíte completa de testes automatizados para assegurar a corretude das operações:

### 1. Testes Lógicos (Node.js)
Valida a precisão matemática do parser e comportamento de precedência aritmética.
*   **Comando**:
    ```bash
    node test-logic.js
    ```
*   **Cobertura**: Mais de 25 cenários estruturados (divisão por zero, parênteses, precedência de operadores, raiz, valores negativos e PI).

### 2. Testes de Interface (UI)
Página interativa com dashboard que simula cliques reais na interface em tempo real.
*   **Como executar**:
    *   Abra o arquivo [test.html](test.html) no seu navegador.
    *   Clique no botão **"Rodar Testes"** para assistir a simulação e verificar o relatório.

---

## 🛠️ Tecnologias utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## 📁 Estrutura do projeto

```
calculadora-brasil/
├── index.html       # Estrutura semântica e esqueleto HTML5
├── style.css        # Design system, neomorfismo e glassmorphism
├── app.js           # Lógica da calculadora, parser de expressões e histórico
├── test.html        # Painel interativo de testes de UI
├── test-logic.js    # Bateria de testes lógicos para terminal (Node.js)
├── eslint.config.js # Regras de linting do código JavaScript
└── .prettierrc      # Regras de formatação de estilo de código
```

---

## 👤 Autor

Desenvolvido por **Claudemir** 💚💛

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/claudemirpc68-del)

---

> *"Feito com 💚 e muito ☕ — Vai, Brasil!"*

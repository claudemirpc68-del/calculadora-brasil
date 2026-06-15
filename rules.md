# Regras do Espaço de Trabalho (Workspace Rules)
Este arquivo define as diretrizes para o desenvolvimento eficiente, com foco na economia de créditos, consumo de tokens e otimização de tempo.

## 1. Princípio da Economia de Créditos e Tokens
*   **Contexto Enxuto**: Evitar o envio de arquivos desnecessariamente longos ou logs completos de erro ao assistente. Enviar apenas os trechos de código ou erros relevantes.
*   **Respostas Concisas**: O assistente deve responder de forma direta e objetiva, priorizando código funcional e explicações curtas.
*   **Evitar Loops**: Interromper e revisar a abordagem caso um bug não seja resolvido após duas tentativas.

## 2. Desenvolvimento Incremental (MVP)
*   **Foco no Core**: Implementar primeiro a funcionalidade mínima viável (MVP). Recursos secundários e melhorias visuais complexas devem ser postergados.
*   **Divisão em Micro-tarefas**: Dividir grandes requisitos em etapas pequenas e independentes, validando cada uma antes de avançar.
*   **Uso de `task.md`**: Manter um checklist simples das atividades em andamento para evitar desvios de foco.

## 3. Pragmatismo Tecnológico
*   **Vanilla First**: Preferir HTML, CSS e JavaScript puros (Vanilla) para interfaces rápidas e leves, reduzindo custos de build, dependências e depuração.
*   **Sem Placeholders**: Gerar dados e elementos funcionais e realistas de primeira, evitando retrabalho para substituir "Lorem Ipsum" ou estruturas fictícias.

## 4. Planejamento Prévio (Modo de Planejamento)
*   **Aprovação de Arquitetura**: Para qualquer alteração que afete mais de 2 arquivos ou mude a estrutura do projeto, criar um `implementation_plan.md` simplificado antes de iniciar a codificação.
*   **Validação Local**: Priorizar testes e execuções de scripts localmente (Python, Node.js) para garantir precisão lógica antes de acoplar à interface ou sistemas de terceiros.

## 5. Diretrizes de Segurança (Security Guidelines)
*   **Tratamento de Segredos**: Nunca codificar credenciais, chaves de API, senhas ou tokens diretamente nos arquivos fonte. Utilize variáveis de ambiente gerenciadas localmente no `.env` (ignorado pelo Git) ou configure-as diretamente no painel do Coolify para produção.
*   **Higienização de Saídas e Logs**: Ao gerar prints, logs ou erros no console para depuração, certifique-se de que chaves privadas, senhas de banco de dados ou dados pessoais dos usuários (como CPF e cartões) sejam omitidos ou mascarados.
*   **Validação de Dependências**: Antes de instalar novos pacotes npm ou bibliotecas de terceiros, validar se eles são amplamente utilizados e se não possuem vulnerabilidades conhecidas (`npm audit`).
*   **Segurança de Ambientes**: Manter os ambientes de Desenvolvimento, Staging e Produção estritamente isolados. Chaves de API de produção nunca devem ser testadas em ambiente de desenvolvimento local.

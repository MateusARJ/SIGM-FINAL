// src/infra/ai/prompts/prova.prompt.ts

export const provaPrompt = `
Você é um professor especialista em Cultura Digital,
atuando no Ensino {{nivel}} (Fundamental ou Médio).

Siga rigorosamente as diretrizes pedagógicas abaixo (BNCC):
{{bnccRegras}}

Contexto da prova:
- Disciplina: {{disciplina}}
- Ano/Série: {{ano}}
- Tema da prova: {{tema}}
- Nível de ensino: {{nivel}}

Crie uma PROVA AVALIATIVA coerente, contendo obrigatoriamente:
1. Instrução clara sobre como responder
2. Questões objetivas (múltipla escolha com 4 alternativas)
3. Questões discursivas (resposta aberta)
4. Questões verdadeiro/falso
5. Critérios de correção para cada questão
6. Gabarito comentado

Utilize linguagem clara, adequada ao nível de ensino informado
e alinhada às diretrizes da BNCC.
`

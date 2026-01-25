# Documentação do Projeto SIGM (Backend)

## 1) Visão geral
O SIGM é um backend em Node.js/TypeScript baseado em Express que expõe uma API REST para **cadastro de anos letivos, disciplinas e assuntos** e para **solicitação de geração de conteúdo didático** via IA. Ele utiliza um repositório em memória (Maps) para persistência temporária e integra com o serviço Gemini para geração de plano de aula, atividade e prova alinhados à BNCC.【F:src/server.ts†L1-L49】【F:src/Domain/repositories/InMemoryRepository.ts†L1-L167】【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】

## 2) Branches disponíveis
Atualmente, o repositório possui apenas a branch `work` localmente, sem outras branches visíveis no clone atual.【F:docs/DOCUMENTACAO_PROJETO.md†L1-L9】

## 3) Estrutura de pastas e responsabilidades
- `src/server.ts`: inicializa o Express, injeta serviços e registra as rotas.【F:src/server.ts†L1-L49】
- `src/Domain/http/routes/*`: rotas REST para anos letivos, disciplinas, assuntos e conteúdos (geração).【F:src/Domain/http/routes/anoLetivo.routes.ts†L1-L70】【F:src/Domain/http/routes/disciplina.routes.ts†L1-L80】【F:src/Domain/http/routes/assunto.routes.ts†L1-L96】【F:src/Domain/http/routes/conteudo.routes.ts†L1-L79】
- `src/Domain/services/*`: regras de negócio (validações, integração com IA).【F:src/Domain/services/AnoLetivoServices.ts†L1-L73】【F:src/Domain/services/DisciplinaService.ts†L1-L92】【F:src/Domain/services/AssuntoService.ts†L1-L93】【F:src/Domain/services/ConteudoService.ts†L1-L84】【F:src/Domain/services/IAClientService.ts†L1-L64】
- `src/Domain/repositories/InMemoryRepository.ts`: persistência em memória (Maps).【F:src/Domain/repositories/InMemoryRepository.ts†L1-L167】
- `src/Domain/Models/*`: tipos básicos e modelos de requisição/registro de conteúdo.【F:src/Domain/Models/TiposBasicos.ts†L1-L17】【F:src/Domain/Models/RequisicaoModelo.ts†L1-L68】
- `src/Domain/ai/*`: camada de IA (DTOs, casos de uso, prompts e integração Gemini).【F:src/Domain/ai/core/dtoAi/entradaDto.ts†L1-L11】【F:src/Domain/ai/core/dtoAi/saidaDto.ts†L1-L4】【F:src/Domain/ai/core/dtoAi/conversor.ts†L1-L36】【F:src/Domain/ai/core/useCases/gerarConteudoUseCase.ts†L1-L41】【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】
- `src/Domain/ai/data/bncc/bncc.json`: regras BNCC usadas nos prompts para IA.【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】

## 4) Executando o projeto
Scripts principais (em `package.json`):
- `npm run dev`: inicia em modo desenvolvimento com `tsx watch`.
- `npm run build`: compila TypeScript.
- `npm start`: roda o build em `dist/server.js`.

Dependências relevantes: Express, UUID, SDK do Gemini (`@google/generative-ai`).【F:package.json†L1-L22】

### Variáveis de ambiente
- `SGI_GEMINI_API_KEY`: **obrigatória** para integração com a IA Gemini. O serviço valida a presença e o conteúdo da chave no start.【F:src/Domain/ai/infra/aiServices/geminiService.ts†L12-L35】

## 5) Modelos de dados (contratos para o frontend)
### Tipos básicos
- `AnoOuSerie`: lista estática de anos/séries aceitos (1º ao 9º ano, 1ª a 3ª série).【F:src/Domain/Models/TiposBasicos.ts†L6-L16】
- `StatusConteudo`: estados de geração (`pendente`, `gerando`, `concluido`, `erro`).【F:src/Domain/Models/TiposBasicos.ts†L18-L18】

### Estruturas de domínio
Definidas em `IConfiguracaoConteudo.ts`:
- `AnoLetivo` → `{ serieId, nome, disciplinas[] }`.
- `Disciplina` → `{ id, serieId, nome, assuntos[] }`.
- `Assunto` → `{ id, nome, disciplinaID }`.
- `DadosComuns` → campos compartilhados na geração (ids, anoLetivo, assuntoTitulo, instrucoesExtras).【F:src/Domain/interfaces/IConfiguracaoConteudo.ts†L11-L41】

### Solicitação e registro de conteúdo
- `SolicitacaoConteudo`: união de `DadosComuns` + configuração específica (aula, prova ou tarefa).【F:src/Domain/Models/RequisicaoModelo.ts†L10-L23】
- `RegistroConteudo`: guarda `requestId`, `solicitacao`, `status`, `resultado` e timestamps.【F:src/Domain/Models/RequisicaoModelo.ts†L25-L33】

### Configurações por tipo de conteúdo
- Aula (`ConfiguracaoAula`): `tipoConteudo = 'aula'`, `numeroSlides`, `incluirImagens`, `incluirAtividades`, `estilo`.
- Prova (`ConfiguracaoProva`): `tipoConteudo = 'prova'`, `numeroQuestoes`, `tiposQuestao`, `nivelDificuldade`, `incluirGabarito`.
- Tarefa (`ConfiguracaoTarefa`): `tipoConteudo = 'tarefa'`, `numeroExercicios`, `incluirExemplos`, `prazoEntrega` (string/Date).【F:src/Domain/interfaces/IConfiguracaoConteudo.ts†L43-L73】

## 6) API REST (contratos de frontend)
Base URL: `http://localhost:3000` (configurável por `PORT`).【F:src/server.ts†L45-L49】

### 6.1) Anos Letivos
**GET `/anosLetivos`** → lista anos letivos.

**GET `/anosLetivos/:id`** → detalhe de um ano letivo.

**GET `/anosLetivos/search/:name`** → busca por nome.

**POST `/anosLetivos`** → cria ano letivo.

**PUT `/anosLetivos/:id`** → atualiza ano letivo.

**DELETE `/anosLetivos/:id`** → remove ano letivo.

As regras de duplicidade são validadas no serviço de ano letivo.【F:src/Domain/http/routes/anoLetivo.routes.ts†L1-L70】【F:src/Domain/services/AnoLetivoServices.ts†L25-L68】

### 6.2) Disciplinas
**GET `/disciplinas`** → lista disciplinas.

**GET `/disciplinas/:id`** → detalhe de uma disciplina.

**GET `/disciplinas/search/:name`** → busca por nome.

**POST `/disciplinas`** → cria disciplina (exige `serieId` válido).

**PUT `/disciplinas/:id`** → atualiza disciplina.

**DELETE `/disciplinas/:id`** → remove disciplina.

Regras: valida nome obrigatório, valida vínculo com ano letivo e bloqueia duplicidade no mesmo `serieId`.【F:src/Domain/http/routes/disciplina.routes.ts†L1-L80】【F:src/Domain/services/DisciplinaService.ts†L22-L78】

### 6.3) Assuntos
**GET `/assuntos`** → lista assuntos.

**GET `/assuntos/:id`** → detalhe de um assunto.

**GET `/assuntos/search/:name`** → busca por nome.

**GET `/assuntos/search/disciplina/:disciplinaId`** → lista assuntos de uma disciplina.

**POST `/assuntos`** → cria assunto (exige disciplina existente).

**PUT `/assuntos/:id`** → atualiza assunto.

**DELETE `/assuntos/:id`** → remove assunto.

Regras: valida disciplina existente e bloqueia duplicidade por nome (case-insensitive).【F:src/Domain/http/routes/assunto.routes.ts†L1-L96】【F:src/Domain/services/AssuntoService.ts†L26-L82】

### 6.4) Conteúdos (IA)
**POST `/conteudos`** → inicia geração de conteúdo; retorna `{ requestId }`.

**GET `/conteudos/:requestId/status`** → retorna `{ status }`.

**GET `/conteudos/:requestId`** → retorna o registro completo (`solicitacao`, `resultado`, etc.).

**PUT `/conteudos/:requestId`** → edita o conteúdo (atualiza `resultado` e marca como `pendente`).

**DELETE `/conteudos/:requestId`** → remove um registro gerado.

Fluxo: ao criar, o serviço salva o registro como `pendente`, chama a IA, atualiza o registro com `concluido` e a resposta. (Atualmente o processamento é síncrono.)【F:src/Domain/http/routes/conteudo.routes.ts†L1-L79】【F:src/Domain/services/ConteudoService.ts†L11-L63】

## 7) Integração com IA (Gemini)
A camada de IA faz a conversão do formato de requisição do serviço (`SolicitacaoConteudo`) para um DTO simplificado (`GerarMaterialDTO`) e então usa a implementação do Gemini.

### 7.1) Conversão de dados
A conversão identifica nível de ensino (fundamental/médio) com base no `anoLetivo`, e mapeia:
- `disciplinaId` → `disciplina`
- `assuntoId` → `tema`
- `anoLetivo` → `ano`
- `nivel` → `fundamental` ou `medio`

A detecção usa regex/strings para anos e séries, e assume **fundamental** se não for médio.【F:src/Domain/ai/core/dtoAi/conversor.ts†L1-L36】

### 7.2) Caso de uso
O caso de uso chama métodos específicos (`gerarPlano`, `gerarAtividade`, `gerarProva`) e devolve `RespostaGeracaoDTO` com `tipo` + `conteudo`.【F:src/Domain/ai/core/useCases/gerarConteudoUseCase.ts†L1-L41】【F:src/Domain/ai/core/dtoAi/saidaDto.ts†L1-L4】

### 7.3) Serviço Gemini
O `GeminiService`:
- exige a variável `SGI_GEMINI_API_KEY`;
- usa o SDK `@google/generative-ai` com o modelo `gemini-2.5-flash`;
- monta prompts com regras da BNCC (`bncc.json`);
- possui métodos para plano de aula, atividade e prova.

Os prompts são definidos em `src/Domain/ai/infra/aiServices/prompts/*` e injetam as regras BNCC no texto final.【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】【F:src/Domain/ai/infra/aiServices/prompts/planoAulaPrompt.ts†L1-L22】【F:src/Domain/ai/infra/aiServices/prompts/atividadePrompt.ts†L1-L21】【F:src/Domain/ai/infra/aiServices/prompts/provaPrompt.ts†L1-L41】

## 8) Observações para o frontend
- **Sem autenticação**: não há controle de acesso implementado nas rotas.
- **Sem banco persistente**: o repositório é em memória, então os dados são perdidos ao reiniciar.
- **Fluxo de geração é síncrono**: a resposta é gerada antes de finalizar o `POST /conteudos` (o status vai de `pendente` → `concluido` no mesmo fluxo). Isso pode afetar UX e tempo de resposta no frontend.【F:src/Domain/services/ConteudoService.ts†L13-L49】【F:src/Domain/repositories/InMemoryRepository.ts†L113-L167】

## 9) Exemplos de payloads
### 9.1) Criar disciplina
```json
{
  "serieId": "uuid-do-ano-letivo",
  "nome": "Matemática",
  "assuntos": []
}
```
A disciplina é validada para garantir existência do `serieId` e não duplicidade no mesmo ano letivo.【F:src/Domain/services/DisciplinaService.ts†L22-L78】

### 9.2) Solicitar conteúdo (aula)
```json
{
  "serieId": "uuid-serie",
  "disciplinaId": "mat-001",
  "assuntoId": "ass-123",
  "anoLetivo": "9º Ano",
  "assuntoTitulo": "Equações",
  "tipoConteudo": "aula",
  "numeroSlides": 15,
  "incluirImagens": true,
  "incluirAtividades": true,
  "estilo": "criativo"
}
```
O serviço gera o conteúdo via IA e salva o resultado associado ao `requestId`.【F:src/Domain/services/ConteudoService.ts†L13-L63】

### 9.3) Solicitar conteúdo (prova)
```json
{
  "serieId": "uuid-serie",
  "disciplinaId": "port-002",
  "assuntoId": "ass-456",
  "anoLetivo": "3ª Série",
  "assuntoTitulo": "Interpretação de Texto",
  "tipoConteudo": "prova",
  "numeroQuestoes": 10,
  "tiposQuestao": ["objetiva", "dissertativa"],
  "nivelDificuldade": "médio",
  "incluirGabarito": true
}
```
A IA retorna `{ tipo: "prova", conteudo: "..." }`.【F:src/Domain/ai/core/dtoAi/saidaDto.ts†L1-L4】【F:src/Domain/services/IAClientService.ts†L33-L60】

### 9.4) Solicitar conteúdo (tarefa)
```json
{
  "serieId": "uuid-serie",
  "disciplinaId": "hist-003",
  "assuntoId": "ass-789",
  "anoLetivo": "7º Ano",
  "assuntoTitulo": "Revolução Industrial",
  "tipoConteudo": "tarefa",
  "numeroExercicios": 5,
  "incluirExemplos": true,
  "prazoEntrega": "2024-12-31T23:59:59Z"
}
```
A IA retorna `{ tipo: "atividade", conteudo: "..." }` (tarefa mapeia para atividade).【F:src/Domain/services/IAClientService.ts†L33-L60】【F:src/Domain/ai/core/dtoAi/saidaDto.ts†L1-L4】


## 10) Comandos usados para levantamento
Os comandos abaixo foram usados para mapear a estrutura e os contratos do backend:
- `git branch -a`
- `ls`, `ls src`, `ls docs`
- `find src -type f`
- `sed -n '1,200p' <arquivo>`
- `cat package.json`
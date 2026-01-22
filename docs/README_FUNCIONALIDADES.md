# README de Funcionalidades (Rotas, API, Services e IA)

## Rotas e API REST
Base URL: `http://localhost:3000` (configurável por `PORT`).【F:src/server.ts†L45-L49】

### Anos Letivos (`/anosLetivos`)
- `GET /anosLetivos` — lista anos letivos.
- `GET /anosLetivos/:id` — retorna detalhe de um ano letivo.
- `GET /anosLetivos/search/:name` — busca por nome.
- `POST /anosLetivos` — cria ano letivo.
- `PUT /anosLetivos/:id` — atualiza ano letivo.
- `DELETE /anosLetivos/:id` — remove ano letivo.【F:src/Domain/http/routes/anoLetivo.routes.ts†L1-L70】

### Disciplinas (`/disciplinas`)
- `GET /disciplinas` — lista disciplinas.
- `GET /disciplinas/:id` — retorna detalhe de disciplina.
- `GET /disciplinas/search/:name` — busca por nome.
- `POST /disciplinas` — cria disciplina.
- `PUT /disciplinas/:id` — atualiza disciplina.
- `DELETE /disciplinas/:id` — remove disciplina.【F:src/Domain/http/routes/disciplina.routes.ts†L1-L80】

### Assuntos (`/assuntos`)
- `GET /assuntos` — lista assuntos.
- `GET /assuntos/:id` — retorna detalhe de assunto.
- `GET /assuntos/search/:name` — busca por nome.
- `GET /assuntos/search/disciplina/:disciplinaId` — busca assuntos de disciplina.
- `POST /assuntos` — cria assunto.
- `PUT /assuntos/:id` — atualiza assunto.
- `DELETE /assuntos/:id` — remove assunto.【F:src/Domain/http/routes/assunto.routes.ts†L1-L96】

### Conteúdos (IA) (`/conteudos`)
- `POST /conteudos` — inicia geração de conteúdo; retorna `{ requestId }`.
- `GET /conteudos/:requestId/status` — retorna `{ status }`.
- `GET /conteudos/:requestId` — retorna o registro completo.
- `PUT /conteudos/:requestId` — atualiza conteúdo (resultado) e marca status como pendente.
- `DELETE /conteudos/:requestId` — remove o registro gerado.【F:src/Domain/http/routes/conteudo.routes.ts†L1-L79】

## Services (Regras de negócio)
### Ano Letivo
- Lista, cria, atualiza e remove anos letivos.
- Valida duplicidade de nome antes de criar.【F:src/Domain/services/AnoLetivoServices.ts†L11-L68】

### Disciplina
- Valida nome obrigatório.
- Exige vínculo com `serieId` existente (ano letivo).
- Bloqueia duplicidade de disciplina no mesmo `serieId`.【F:src/Domain/services/DisciplinaService.ts†L22-L78】

### Assunto
- Exige disciplina existente.
- Bloqueia duplicidade de nome (case-insensitive).【F:src/Domain/services/AssuntoService.ts†L26-L82】

### Conteúdo
- Salva solicitação com status `pendente`.
- Chama IA e atualiza status para `concluido` com o conteúdo gerado.
- Permite editar resultado e excluir registros.【F:src/Domain/services/ConteudoService.ts†L11-L84】

## Camada de IA
### Conversão de dados
Converte `SolicitacaoConteudo` para `GerarMaterialDTO`, inferindo nível de ensino (fundamental/médio) pelo `anoLetivo` e mapeando campos para `disciplina`, `ano` e `tema`.【F:src/Domain/ai/core/dtoAi/conversor.ts†L1-L36】

### Caso de uso
`GerarConteudoUseCase` centraliza as chamadas para `gerarPlano`, `gerarAtividade` e `gerarProva`, retornando `{ tipo, conteudo }`.【F:src/Domain/ai/core/useCases/gerarConteudoUseCase.ts†L1-L41】

### Serviço Gemini
- Usa o SDK `@google/generative-ai`.
- Modelo configurado: `gemini-2.5-flash`.
- Monta prompts com regras da BNCC para aula, atividade e prova.【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】
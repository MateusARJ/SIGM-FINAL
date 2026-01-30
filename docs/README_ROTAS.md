# Rotas Detalhadas da API

## Base URL
- `http://localhost:3000` (porta definida por `PORT`).【F:src/server.ts†L45-L49】

## Anos Letivos
### `GET /anosLetivos`
Lista todos os anos letivos cadastrados.【F:src/Domain/http/routes/anoLetivo.routes.ts†L6-L10】

### `GET /anosLetivos/:id`
Retorna o ano letivo pelo `id`. Retorna 404 se não existir.【F:src/Domain/http/routes/anoLetivo.routes.ts†L12-L20】

### `GET /anosLetivos/search/:name`
Busca ano letivo por nome (case-insensitive via service).【F:src/Domain/http/routes/anoLetivo.routes.ts†L22-L30】【F:src/Domain/services/AnoLetivoServices.ts†L21-L24】

### `POST /anosLetivos`
Cria ano letivo. Valida duplicidade de nome no service.【F:src/Domain/http/routes/anoLetivo.routes.ts†L44-L52】【F:src/Domain/services/AnoLetivoServices.ts†L25-L44】

### `PUT /anosLetivos/:id`
Atualiza ano letivo pelo `id`. Retorna o objeto atualizado no service.【F:src/Domain/http/routes/anoLetivo.routes.ts†L54-L62】【F:src/Domain/services/AnoLetivoServices.ts†L46-L61】

### `DELETE /anosLetivos/:id`
Remove ano letivo pelo `id`.【F:src/Domain/http/routes/anoLetivo.routes.ts†L64-L69】

## Disciplinas
### `GET /disciplinas`
Lista disciplinas cadastradas.【F:src/Domain/http/routes/disciplina.routes.ts†L6-L10】

### `GET /disciplinas/:id`
Retorna disciplina pelo `id`.【F:src/Domain/http/routes/disciplina.routes.ts†L12-L20】

### `GET /disciplinas/search/:name`
Busca disciplina por nome.【F:src/Domain/http/routes/disciplina.routes.ts†L22-L30】

### `POST /disciplinas`
Cria disciplina. Exige `serieId` válido e bloqueia duplicidade no mesmo ano letivo.【F:src/Domain/http/routes/disciplina.routes.ts†L44-L52】【F:src/Domain/services/DisciplinaService.ts†L31-L78】

### `PUT /disciplinas/:id`
Atualiza disciplina pelo `id`.【F:src/Domain/http/routes/disciplina.routes.ts†L54-L61】

### `DELETE /disciplinas/:id`
Remove disciplina pelo `id`.【F:src/Domain/http/routes/disciplina.routes.ts†L63-L70】

## Assuntos
### `GET /assuntos`
Lista assuntos cadastrados.【F:src/Domain/http/routes/assunto.routes.ts†L6-L10】

### `GET /assuntos/search/:name`
Busca assunto por nome.【F:src/Domain/http/routes/assunto.routes.ts†L14-L29】

### `GET /assuntos/search/disciplina/:disciplinaId`
Busca assuntos de uma disciplina específica.【F:src/Domain/http/routes/assunto.routes.ts†L38-L52】

### `GET /assuntos/:id`
Retorna assunto pelo `id`.【F:src/Domain/http/routes/assunto.routes.ts†L54-L62】

### `POST /assuntos`
Cria assunto e valida disciplina existente. Também bloqueia duplicidade de nome.【F:src/Domain/http/routes/assunto.routes.ts†L64-L72】【F:src/Domain/services/AssuntoService.ts†L43-L82】

### `PUT /assuntos/:id`
Atualiza assunto pelo `id`.【F:src/Domain/http/routes/assunto.routes.ts†L74-L81】

### `DELETE /assuntos/:id`
Remove assunto pelo `id`.【F:src/Domain/http/routes/assunto.routes.ts†L83-L90】

## Conteúdos (IA)
### `POST /conteudos`
Cria solicitação de geração e retorna `{ requestId }`.【F:src/Domain/http/routes/conteudo.routes.ts†L9-L21】

### `GET /conteudos/:requestId/status`
Retorna o status atual da geração (ex: `pendente`, `concluido`).【F:src/Domain/http/routes/conteudo.routes.ts†L29-L45】

### `GET /conteudos/:requestId`
Retorna o conteúdo gerado e metadados do registro.【F:src/Domain/http/routes/conteudo.routes.ts†L47-L61】

### `PUT /conteudos/:requestId`
Atualiza o resultado do conteúdo e marca como `pendente`.【F:src/Domain/http/routes/conteudo.routes.ts†L63-L74】【F:src/Domain/services/ConteudoService.ts†L41-L63】

### `DELETE /conteudos/:requestId`
Remove registro de conteúdo gerado.【F:src/Domain/http/routes/conteudo.routes.ts†L76-L84】
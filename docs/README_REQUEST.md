# README de Requests e Exemplos de Uso

## Modelo de solicitação de conteúdo
`SolicitacaoConteudo` combina dados comuns com a configuração específica de aula, prova ou tarefa.【F:src/Domain/Models/RequisicaoModelo.ts†L10-L23】【F:src/Domain/interfaces/IConfiguracaoConteudo.ts†L27-L73】

### Dados comuns (sempre enviados)
Campos da interface `DadosComuns`:
- `serieId`
- `disciplinaId`
- `assuntoId`
- `anoLetivo`
- `assuntoTitulo`
- `instrucoesExtras` (opcional)【F:src/Domain/interfaces/IConfiguracaoConteudo.ts†L27-L41】

## Exemplos de payloads
### 1) Criar ano letivo
`POST /anosLetivos`
```json
{
  "nome": "9º Ano",
  "disciplinas": []
}
```
Regras: bloqueia duplicidade de nome.【F:src/Domain/services/AnoLetivoServices.ts†L25-L44】

### 2) Criar disciplina
`POST /disciplinas`
```json
{
  "serieId": "uuid-do-ano-letivo",
  "nome": "Matemática",
  "assuntos": []
}
```
Regras: exige `serieId` válido e bloqueia duplicidade no mesmo ano letivo.【F:src/Domain/services/DisciplinaService.ts†L22-L78】

### 3) Criar assunto
`POST /assuntos`
```json
{
  "nome": "Equações",
  "disciplinaID": "uuid-da-disciplina"
}
```
Regras: exige disciplina existente e bloqueia duplicidade por nome.【F:src/Domain/services/AssuntoService.ts†L26-L82】

### 4) Solicitar conteúdo (aula)
`POST /conteudos`
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
Geração síncrona: o serviço salva, chama a IA e atualiza o status para `concluido` com o resultado.【F:src/Domain/services/ConteudoService.ts†L11-L63】

### 5) Solicitar conteúdo (prova)
`POST /conteudos`
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

### 6) Solicitar conteúdo (tarefa)
`POST /conteudos`
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
A IA retorna `{ tipo: "atividade", conteudo: "..." }`.【F:src/Domain/ai/core/dtoAi/saidaDto.ts†L1-L4】【F:src/Domain/services/IAClientService.ts†L33-L60】

## Respostas típicas
### `POST /conteudos`
```json
{
  "requestId": "uuid-gerado"
}
```
O `requestId` serve para consultar status e obter o conteúdo final.【F:src/Domain/http/routes/conteudo.routes.ts†L9-L27】

### `GET /conteudos/:requestId/status`
```json
{
  "status": "concluido"
}
```
Status vem do registro armazenado no repositório.【F:src/Domain/http/routes/conteudo.routes.ts†L29-L45】【F:src/Domain/repositories/InMemoryRepository.ts†L151-L166】

### `GET /conteudos/:requestId`
```json
{
  "requestId": "uuid",
  "solicitacao": { "...": "..." },
  "status": "concluido",
  "resultado": { "tipo": "planoAula", "conteudo": "..." },
  "criadoEm": "2024-01-01T00:00:00.000Z",
  "atualizadoEm": "2024-01-01T00:00:01.000Z"
}
```
O formato segue `RegistroConteudo` no domínio.【F:src/Domain/Models/RequisicaoModelo.ts†L25-L33】
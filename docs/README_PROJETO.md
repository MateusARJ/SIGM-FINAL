# README do Projeto SIGM

## Visão geral
O SIGM é um backend em Node.js/TypeScript com Express que expõe uma API REST para cadastro de anos letivos, disciplinas e assuntos, além de permitir a geração de conteúdo didático via IA (Gemini). Ele utiliza um repositório em memória para persistência temporária e integra a camada de IA com prompts alinhados à BNCC.【F:src/server.ts†L1-L49】【F:src/Domain/repositories/InMemoryRepository.ts†L1-L167】【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】

## Como rodar
Scripts principais (package.json):
- `npm run dev` — ambiente de desenvolvimento com `tsx watch`.
- `npm run build` — compila TypeScript.
- `npm start` — executa `dist/server.js` após build.【F:package.json†L1-L22】

### Variáveis de ambiente
- `SGI_GEMINI_API_KEY` é obrigatória para chamadas ao Gemini (SDK Google). O serviço valida a presença e a chave não vazia na inicialização.【F:src/Domain/ai/infra/aiServices/geminiService.ts†L12-L35】

## Estrutura do projeto
- `src/server.ts`: bootstrap do Express e injeção de services nas rotas.【F:src/server.ts†L1-L49】
- `src/Domain/http/routes/*`: rotas REST (anos, disciplinas, assuntos, conteúdos).【F:src/Domain/http/routes/anoLetivo.routes.ts†L1-L70】【F:src/Domain/http/routes/disciplina.routes.ts†L1-L80】【F:src/Domain/http/routes/assunto.routes.ts†L1-L96】【F:src/Domain/http/routes/conteudo.routes.ts†L1-L79】
- `src/Domain/services/*`: regras de negócio e validações de domínio.【F:src/Domain/services/AnoLetivoServices.ts†L1-L73】【F:src/Domain/services/DisciplinaService.ts†L1-L92】【F:src/Domain/services/AssuntoService.ts†L1-L93】【F:src/Domain/services/ConteudoService.ts†L1-L84】
- `src/Domain/ai/*`: camada de IA (DTOs, prompts, integração Gemini).【F:src/Domain/ai/core/dtoAi/entradaDto.ts†L1-L11】【F:src/Domain/ai/core/dtoAi/conversor.ts†L1-L36】【F:src/Domain/ai/infra/aiServices/geminiService.ts†L1-L126】

## Observações importantes
- Não há autenticação nas rotas atuais.
- O repositório é em memória, então os dados são perdidos ao reiniciar.
- A geração de conteúdo é síncrona no fluxo do `POST /conteudos` (salva, chama IA e conclui).【F:src/Domain/services/ConteudoService.ts†L11-L63】【F:src/Domain/repositories/InMemoryRepository.ts†L113-L167】
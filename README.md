# SIGM
# SIGM — Plataforma de Geração de Conteúdos Educacionais com IA

Http dentro da Domain é apenas para teste  
> **Bem-vindo ao SIGM**: um backend em Node.js + TypeScript que organiza **Ano Letivo → Disciplina → Assunto** e gera conteúdos educacionais (aula, prova, tarefa) alinhados à BNCC, com suporte a RAG via ChromaDB e geração pela Gemini.

Na pasta repositories InMemoryRepository é um banco de dados em memória para testes
---

## ✨ O que você pode fazer aqui (mapa rápido de funcionalidades)

- **Gerenciar estrutura acadêmica** (Ano Letivo, Disciplina, Assunto).
- **Gerar conteúdo educacional com IA**: plano de aula, prova ou tarefa, com requisitos pedagógicos.
- **Acompanhar status** da geração e **editar/excluir** resultados.
- **Integrar RAG** com documentos oficiais BNCC/MEC para enriquecer a geração.

> **Interação rápida**: escolha seu caminho abaixo e siga o link.
> - 🧭 Quero rodar o projeto agora → [Guia Rápido](#-guia-rápido)
> - 🧠 Quero entender a arquitetura → [Arquitetura & Fluxos](#-arquitetura--fluxos)
> - 🔌 Quero conhecer as rotas → [Rotas/Endpoints](#-rotasendpoints)
> - 🧱 Quero o inventário completo de arquivos → [Inventário de Arquivos](#-inventário-de-arquivos)

---

## 🚀 Guia Rápido

### 1) Instalação

```bash
npm install
```

### 2) Banco de dados (Prisma + SQLite)

```bash
mkdir -p /app/data
```
**O que faz:** cria o diretório de persistência local.

```bash
npx prisma migrate deploy
```
**O que faz:** aplica as migrations e prepara o banco dentro de `data/`.

### 3) Rodar a API

```bash
npm start
```
**O que faz:** executa o servidor configurado em `src/server.ts`.

> ✅ **Interação sugerida**: após iniciar, tente um `GET /anosLetivos` para validar a API.

---

## 🧠 Arquitetura & Fluxos

### Visão geral (camadas)

```
src/
├─ app/          # Rotas HTTP (Express)
├─ domain/       # Regras de negócio (Modelos, Interfaces, UseCases, Services)
└─ infra/        # Infraestrutura (Prisma, IA, RAG)
```

### Fluxo principal de geração de conteúdo

1. **API recebe solicitação** em `/conteudos`.
2. **ConteudoService** delega para `CriarConteudoUseCase`.
3. **UseCase** grava status `pendente` e dispara **IAClientService**.
4. **IAClientService** resolve nomes (ano/discip/assunto), converte para DTO da IA.
5. **GeminiService** aplica prompt + RAG + regras BNCC e gera o material.
6. **Status** passa para `concluido` ou `erro`.

> 💡 Interação: tente acompanhar o status em `/conteudos/:requestId/status`.

---

## 🔌 Rotas/Endpoints

### Estrutura acadêmica
- **Anos Letivos**: `/anosLetivos`
- **Disciplinas**: `/disciplinas`
- **Assuntos**: `/assuntos`

### Geração de conteúdo
- **Criar**: `POST /conteudos`
- **Status**: `GET /conteudos/:requestId/status`
- **Resultado**: `GET /conteudos/:requestId` ou `GET /conteudos/:requestId/result`
- **Editar**: `PUT /conteudos/:requestId`
- **Excluir**: `DELETE /conteudos/:requestId`

> 📌 Detalhes completos no [README da camada App](src/app/README.md).

---

## 🧾 Inventário de Arquivos

> Este inventário cobre **todos os arquivos do repositório** (exceto `node_modules/`).

- **Raiz**
  - `Dockerfile` — build da imagem para execução.
  - `docker-compose.yaml` — orquestração de serviços (ex.: ChromaDB).
  - `package.json` / `package-lock.json` — dependências e scripts.
  - `tsconfig.json` — configuração TypeScript.
  - `README.md` — este documento.

- **docs/** — documentação histórica e funcional
  - `README_PROJETO.md`, `README_FUNCIONALIDADES.md`, `README_ROTAS.md`, `README_REQUEST.md`.
  - `RESUMO_PROJETO.MD`, `RESUMO_IMPLEMENTACAO_FINAL.md`, `conteudoV1.md`.
  - `prisma_bd.md`, `RAG_COM DOCKER_E_CHROMADB.md`.

- **docs_source/** — PDFs de referência (BNCC/MEC)
  - `BNCC_versaofinal.pdf`, `bnccv1.pdf`, `EDUCACAO_DIGITAL_E_MIDIATICA.pdf`.
  - `mec-educacao-digitalv1.pdf`, `Politica_Nacional_Educacao_Digital.pdf`.

- **prisma/** — banco e schema
  - `schema.prisma` — modelo principal.
  - `migrations/*` — histórico SQL de migrations.
  - `dev.db` — banco local SQLite.

- **requests/** — coleções de API
  - `insomnia_hackaton.yaml`, `insomnia_hackathon.json`, `insomnia_hackaton_Exemplos.json`.

- **scripts/** — utilitários
  - `check-db.js` — valida conexão/estado do banco.
  - `ingest-bncc.ts` — ingestão RAG para ChromaDB.

- **src/** — código de aplicação
  - `server.ts` — bootstrap do Express e injeções.
  - `app/` — rotas e controllers HTTP.
  - `domain/` — modelos, interfaces, serviços e casos de uso.
  - `infra/` — repositórios e camada de IA/RAG.

---

## 🔗 Front-end e Back-end

- 1. Repositório do front: https://github.com/MateusARJ/FrontEnd-SIGM
- 2. Back-end deploy: https://sigm-hackathon-production.up.railway.app/
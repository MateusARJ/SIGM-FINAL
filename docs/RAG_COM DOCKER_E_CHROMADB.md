
---

# 📘 Documentação de Implementação do RAG - Projeto SIGM

**Data:** 24/01/2026
**Responsável:** Vitor (Backend/DevOps)
**Contexto:** Implementação de Recuperação Aumentada por Geração (RAG) para planos de aula baseados na BNCC.

---

## 🏗️ 1. Arquitetura da Solução

Optamos por uma **Arquitetura Híbrida e Econômica**, focada em não gastar tokens de API desnecessariamente durante a indexação e busca.

* **Banco de Dados (Vector DB):** ChromaDB rodando em **Docker** (persistência local).
* **Embeddings (Vetorização):** Modelo **Local** (`Xenova/paraphrase-multilingual-MiniLM-L12-v2`). Roda na CPU, custo zero.
* **Geração de Texto:** Gemini API (Google). Apenas gera o texto final, recebendo o contexto pronto.
* **Ingestão de Dados:** Script customizado usando `pdf2json` para processar PDFs oficiais da BNCC.

### Fluxo de Dados

1. **Ingestão:** PDF → Texto → Vetor (Local) → ChromaDB (Docker).
2. **Busca:** Pergunta do Usuário → Vetor (Local) → Busca no ChromaDB → Contexto Recuperado.
3. **Geração:** Contexto + Prompt → Gemini API → Plano de Aula.

---

## 🛠️ 2. Infraestrutura (Docker)

O banco de dados vetorial roda isolado em container para facilitar o deploy e não poluir o sistema operacional.

**Arquivo:** `docker-compose.yml` (Raiz)

```yaml
version: '3.9'

services:
  vectordb:
    image: chromadb/chroma:latest
    container_name: bncc_vectordb
    ports:
      - "8000:8000" # Acesso via http://localhost:8000
    volumes:
      - ./chroma_data:/chroma/.chroma/index # Persistência de dados
    environment:
      - IS_PERSISTENT=TRUE
      - ANONYMIZED_TELEMETRY=FALSE
    networks:
      - hackathon-net

networks:
  hackathon-net:
    driver: bridge

```

**Comando para rodar:**

```bash
docker compose up -d

```

---

## 📦 3. Dependências do Projeto

Bibliotecas adicionadas ao `package.json` para suportar o RAG:

* `chromadb`: Cliente para conectar no banco Docker.
* `@xenova/transformers`: Inteligência Artificial rodando localmente (Node.js) para criar vetores.
* `pdf2json`: Leitura robusta de PDFs (substituiu o `pdf-parse` por incompatibilidade).

**Instalação:**

```bash
npm install chromadb @xenova/transformers pdf2json dotenv
npm install --save-dev @types/pdf2json

```

---

## 🔄 4. Módulo de Ingestão (ETL)

Script responsável por ler os PDFs da pasta `docs_rag/`, "quebrar" em pedaços e salvar no banco.

**Local:** `scripts/ingest-bncc.ts`
**Destaque:** Usa IA Local para não gastar cota do Google.

```typescript
// Resumo do algoritmo:
// 1. Conecta no ChromaDB (Porta 8000)
// 2. Carrega modelo Xenova (Local)
// 3. Lê pasta /docs_rag
// 4. Usa pdf2json para extrair texto
// 5. Gera vetores e salva no banco com metadados (Fonte/Página)

```

**Como rodar (da raiz do projeto):**

```bash
npx ts-node scripts/ingest-bncc.ts

```

---

## 🧠 5. Serviços de Integração (Backend)

### A. O Buscador (`BnccRetriever`)

Classe que encapsula a lógica de busca. O restante do sistema não sabe que existe Docker ou IA Local aqui.

**Local:** `src/infra/retriveal/bnccRetriever.ts`

* **Função:** `recuperarContexto(dto)`
* **Lógica:** Converte o tema da aula em vetor (usando o mesmo modelo da ingestão) e busca os 3 trechos mais similares na BNCC.

### B. O Gerador (`GeminiService`)

Serviço atualizado para consumir o RAG antes de chamar a IA.

**Local:** `src/infra/ai/geminiService.ts`
**Lógica do Prompt:**

```typescript
const promptFinal = `
${contextoRag} // <--- Dados da BNCC injetados aqui

IMPORTANTE: Você deve priorizar as diretrizes do CONTEXTO OFICIAL acima.

${promptOriginal}
`;

```

---

## 📂 6. Estrutura de Pastas Atualizada

```text
SIGM/
├── docker-compose.yml       # Infra do Banco Vetorial
├── chroma_data/             # Dados do banco (gerado pelo Docker)
├── docs_rag/                # Onde ficam os PDFs oficiais (BNCC, etc)
├── scripts/
│   └── ingest-bncc.ts       # Script de Ingestão (Roda 1 vez)
├── src/
│   ├── infra/
│   │   ├── retriveal/
│   │   │   ├── bnccRetriever.ts  # Busca os dados no Docker
│   │   │   └── interfaces/
│   │   └── ai/
│   │       └── GeminiService.ts  # Integra RAG + Gemini

```

---

## ✅ 7. Check-list de Execução

Para o sistema funcionar em um ambiente novo (ex: AWS ou outro PC):

1. [ ] Ter **Docker** e **Node.js** instalados.
2. [ ] Colocar os PDFs na pasta `docs_rag`.
3. [ ] Subir o banco: `docker compose up -d`.
4. [ ] Instalar dependências: `npm install`.
5. [ ] Popular o banco: `npx ts-node script/ingest-bncc.ts`.
6. [ ] Rodar a API: `npm run dev`.

---

### 📝 Notas de Manutenção

* **Erro de PDF:** Se tiver problemas com leitura de PDF, verifique se a lib `pdf2json` está sendo usada. O `pdf-parse` antigo foi removido.
* **Modelos:** O modelo de ingestão e o de busca **DEVEM** ser o mesmo (`Xenova/paraphrase-multilingual-MiniLM-L12-v2`). Se trocar um, tem que re-ingerir tudo.
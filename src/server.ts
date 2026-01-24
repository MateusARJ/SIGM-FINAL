// src/server.ts

import express from 'express';
import 'dotenv/config';

import { InMemoryRepository } from './infra/repositories/InMemoryRepository';

import { AssuntoService } from './domain/services/AssuntoService';
import { DisciplinaService } from './domain/services/DisciplinaService';
import { ConteudoService } from './domain/services/ConteudoService';
import { AnoLetivoService } from './domain/services/AnoLetivoServices';

import { CriarConteudoUseCase } from "./domain/usecases/CriarConteudoUseCase";
import { ObterConteudoUseCase } from "./domain/usecases/ObterConteudoUseCase"
import { VerificarStatusUseCase } from "./domain/usecases/VerificarStatusUseCase"
import { EditarConteudoUseCase } from "./domain/usecases/EditarConteudoUseCase"
import { ExcluirConteudoUseCase } from "./domain/usecases/ExcluirConteudoUseCase"

import { assuntoRoutes } from './app/routes/assunto.routes';
import { disciplinaRoutes } from './app/routes/disciplina.routes';
import { conteudoRoutes } from './app/Controller/ConteudoController';
import { anoLetivoRoutes } from './app/routes/anoLetivo.routes';

import { IAClientService } from './domain/services/IAClientService';

/**
 * 🔹 RAG - Bootstrap de conhecimento pedagógico
 */
import { RagBootstrap } from './infra/ai/infra/retrieval/bootstrap/ragBootstrap';
import { VectorBnccRetriever } from './infra/ai/infra/retrieval/vectorBnccRetriever';
import { GeminiEmbeddingService } from './infra/ai/infra/retrieval/core/embedding/geminiEmbeddingService';

const app = express();
app.use(express.json());

async function bootstrap() {

  /**
   * 🔹 0. Inicializa base pedagógica (RAG)
   * Executado UMA ÚNICA VEZ no boot da aplicação
   */
  const vectorStore = await RagBootstrap.initialize()

  const apiKey = process.env.SGI_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('SGI_GEMINI_API_KEY não definida no ambiente')
  }

  const embeddingService = new GeminiEmbeddingService(apiKey)

  const bnccRetriever = new VectorBnccRetriever(
    vectorStore,
    embeddingService
  )

  /**
   * 🔹 1. Cria a infraestrutura
   * (baixo nível)
   */
  const repository = new InMemoryRepository();
  const ia = new IAClientService(repository, bnccRetriever);

  const criarUseCase = new CriarConteudoUseCase(repository, ia)
  const editarUseCase = new EditarConteudoUseCase(repository)
  const excluirUseCase = new ExcluirConteudoUseCase(repository)
  const verificarUseCase = new VerificarStatusUseCase(repository)
  const obterUseCase = new ObterConteudoUseCase(repository)

  /**
   * 🔹 2. Cria os services
   * (alto nível, dependem apenas de interfaces)
   */
  const assuntoService = new AssuntoService(repository);
  const disciplinaService = new DisciplinaService(repository);
  const conteudoService = new ConteudoService(
    criarUseCase,
    obterUseCase,
    verificarUseCase,
    editarUseCase,
    excluirUseCase
  );
  const anoLetivoService = new AnoLetivoService(repository);

  /**
   * 🔹 3. Injeta os services nas rotas
   */
  app.use("/anosLetivos", anoLetivoRoutes(anoLetivoService));
  app.use("/assuntos", assuntoRoutes(assuntoService));
  app.use("/disciplinas", disciplinaRoutes(disciplinaService));

  /**
   * 🔹 4. Injeta ConteudoService como facade do ControllerConteudos
   */
  app.use("/conteudos", conteudoRoutes(conteudoService));

  /**
   * 🔹 5. Sobe o servidor
   */
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

bootstrap().catch(error => {
  console.error('❌ Erro fatal ao iniciar servidor:', error);
  process.exit(1);
});

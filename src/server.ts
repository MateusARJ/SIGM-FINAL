// src/server.ts
import express from 'express';
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

const app = express();
app.use(express.json());

/**
 * 🔹 1. Cria a infraestrutura
 * (baixo nível)
 */
const repository = new InMemoryRepository();
const ia = new IAClientService();
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
const conteudoService = new ConteudoService(criarUseCase, obterUseCase, verificarUseCase, editarUseCase, excluirUseCase);
const anoLetivoService = new AnoLetivoService(repository);

/**
 * 🔹 3. Injeta os services nas rotas
 */
app.use("/anosLetivos", anoLetivoRoutes(anoLetivoService));
app.use("/assuntos", assuntoRoutes(assuntoService));
app.use("/disciplinas", disciplinaRoutes(disciplinaService));

/**
 *  4. Injeta ConteudoService como facade do ControllerConteusos
 */
app.use("/conteudos", conteudoRoutes(conteudoService));

/**
 * 🔹 5. Sobe o servidor
 */
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

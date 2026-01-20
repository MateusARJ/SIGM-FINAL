// src/server.ts
import express from 'express';
import { InMemoryRepository } from './Domain/repositories/InMemoryRepository';

import { AssuntoService } from './Domain/services/AssuntoService';
import { DisciplinaService } from './Domain/services/DisciplinaService';
import { ConteudoService } from './Domain/services/ConteudoService';
import { AnoLetivoService } from './Domain/services/AnoLetivoServices';

import { assuntoRoutes } from './Domain/http/routes/assunto.routes';
import { disciplinaRoutes } from './Domain/http/routes/disciplina.routes';
import { conteudoRoutes } from './Domain/http/routes/conteudo.routes';
import { anoLetivoRoutes } from './Domain/http/routes/anoLetivo.routes';

import { IAClientService } from './Domain/services/IAClientService';

const app = express();
app.use(express.json());

/**
 * 🔹 1. Cria a infraestrutura
 * (baixo nível)
 */
const repository = new InMemoryRepository();
const ia = new IAClientService();

/**
 * 🔹 2. Cria os services
 * (alto nível, dependem apenas de interfaces)
 */
const assuntoService = new AssuntoService(repository);
const disciplinaService = new DisciplinaService(repository);
const conteudoService = new ConteudoService(repository, ia);
const anoLetivoService = new AnoLetivoService(repository);

/**
 * 🔹 3. Injeta os services nas rotas
 */
app.use("/anosLetivos", anoLetivoRoutes(anoLetivoService));
app.use("/assuntos", assuntoRoutes(assuntoService));
app.use("/disciplinas", disciplinaRoutes(disciplinaService));
app.use("/conteudos", conteudoRoutes(conteudoService));

/**
 * 🔹 4. Sobe o servidor
 */
const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// src/server.ts
import express from 'express';
import { InMemoryRepository } from './Domain/repositories/InMemoryRepository';
import type { Disciplina } from './Domain/interfaces/IConfiguracaoConteudo';
import { v4 as uuidv4 } from 'uuid'; // Instale: npm i uuid && npm i -D @types/uuid

const app = express();
app.use(express.json());

// 1. Instância do Repositório (Aqui é onde a mágica da Inversão acontece)
// Se amanhã você quiser usar Firebase, basta mudar para: new FirestoreRepository()
const repository = new InMemoryRepository();

// ========================
// ROTAS PARA TESTE NO INSOMNIA
// ========================

// --- Disciplinas ---

app.post('/disciplinas', async (req, res) => {
    try {
        const { name, grade } = req.body;
        // Criando o objeto aqui, mas o ideal seria ter um DTO
        const novaDisciplina: Disciplina = {
            id: uuidv4(),
            nome: name,
            Assuntos: grade,
        };
        
        await repository.addDisciplina(novaDisciplina);
        return res.status(201).json(novaDisciplina);
    } catch (error) {
        return res.status(500).send("Erro ao criar disciplina");
    }
});

app.get('/disciplinas', async (req, res) => {
    const disciplinas = await repository.getAllDisciplinas();
    return res.json(disciplinas);
});

// --- Conteúdos Gerados ---

app.post('/conteudos/mock-save', async (req, res) => {
    // Rota para simular que a IA gerou algo e salvamos o link
    const { requestId, url } = req.body;
    await repository.saveGeneratedContentResponse(requestId, url);
    return res.status(201).send("Conteúdo salvo no histórico");
});

app.get('/conteudos/busca', async (req, res) => {
    const { q } = req.query;
    if (typeof q !== 'string') return res.status(400).send("Query invalida");
    
    const resultados = await repository.searchGeneratedContentResponses(q);
    return res.json(resultados);
});

// ========================
// INICIAR SERVER
// ========================
app.listen(3333, () => {
    console.log('🚀 Server rodando em http://localhost:3333');
    console.log('📦 Usando Banco de Dados: IN-MEMORY (Dados somem ao reiniciar)');
});
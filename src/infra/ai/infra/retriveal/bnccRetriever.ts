// src/infra/retriveal/bnccRetriever.ts
import { IBnccRetriever } from "./interfaces/IBnccRetriever";
import { GerarMaterialDTO } from "../../core/dtoAi/entradaDto";
import { ChromaClient } from 'chromadb';
import { pipeline } from '@xenova/transformers';

export class BnccRetriever implements IBnccRetriever {
    private client: ChromaClient;
    private extractor: any = null; // Guardará o modelo de IA na memória
    private readonly collectionName = 'bncc-docs'; // MESMO NOME usado na ingestão

    constructor() {
        // Conecta ao container Docker rodando na porta 8000
        this.client = new ChromaClient({ path: 'http://localhost:8000' });
    }

    // Carrega a IA Local (Lazy Loading - só carrega na primeira vez)
    private async initAI() {
        if (!this.extractor) {
            console.log("🧠 Carregando modelo de embeddings local (Xenova)...");
            // TEM QUE SER O MESMO MODELO DO SCRIPT DE INGESTÃO
            this.extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
        }
    }

    async recuperarContexto(dados: GerarMaterialDTO): Promise<string> {
        try {
            await this.initAI();

            // 1. Monta a Query Semântica
            // Juntamos tema, disciplina e ano para dar contexto total ao vetor
            const queryTexto = `Diretrizes BNCC para ${dados.disciplina} ${dados.ano} sobre ${dados.tema}`;
            console.log(`🔎 Buscando no ChromaDB: "${queryTexto}"`);

            // 2. Gera o Vector da busca (Localmente, sem gastar token)
            const output = await this.extractor(queryTexto, { pooling: 'mean', normalize: true });
            const queryVector = Array.from(output.data);

            // 3. Busca no Docker
            const collection = await this.client.getCollection({ name: this.collectionName });
            const results = await collection.query({
                queryEmbeddings: [queryVector] as number[][], // Usa o vetor numérico
                nResults: 3 // Traz os 3 trechos mais relevantes
            });

            // 4. Verifica se achou algo
            const documentos = results.documents[0];
            const metadados = results.metadatas[0];

            if (!documentos || documentos.length === 0) {
                console.log("⚠️ Nenhum documento relevante encontrado no RAG.");
                return "Nenhuma diretriz específica da BNCC encontrada no banco de dados para este tema.";
            }

            // 5. Formata o retorno para o Prompt
            const contextoFormatado = documentos.map((texto, index) => {
                const fonte = metadados?.[index]?.fonte || 'Documento Oficial';
                return `[FONTE: ${fonte}]\n${texto}\n---`;
            }).join('\n');

            console.log(`✅ ${documentos.length} referências da BNCC recuperadas.`);
            return `
=== CONTEXTO OFICIAL (RAG - BNCC & DIRETRIZES) ===
As informações abaixo foram extraídas de documentos oficiais (BNCC/MEC).
Utilize-as como a BASE VERDADEIRA para o conteúdo.

${contextoFormatado}
==================================================`;

        } catch (error) {
            console.error("❌ Erro ao consultar RAG (ChromaDB):", error);
            // Fallback: Se o Docker cair, o sistema não para, mas avisa.
            return "Erro ao recuperar contexto da BNCC. Utilize conhecimentos gerais alinhados à base.";
        }
    }
}
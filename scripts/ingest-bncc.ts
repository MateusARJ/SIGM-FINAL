import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { pipeline } from '@xenova/transformers';
import pdf from 'pdf-parse';

// -------------------------------------------

// --- CONFIGURAÇÕES ---
// Se você já renomeou as pastas para 'data', mude aqui.
// Vou deixar 'docs_rag' para garantir que funcione agora.
const PASTA_DOCS = path.join(process.cwd(), 'docs_source'); 
const COLLECTION_NAME = 'bncc-docs';
const CHROMA_URL = 'http://localhost:8000';

const chroma = new ChromaClient({ path: CHROMA_URL });

async function main() {
    console.log("🚀 Iniciando ingestão com PDF-PARSE v1.1.1...");

    console.log("📥 Carregando modelo de embeddings local...");
    const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');

    // Limpa e recria a coleção
    try { await chroma.deleteCollection({ name: COLLECTION_NAME }); } catch (e) { /* Ignora */ }
    const collection = await chroma.createCollection({ name: COLLECTION_NAME });

    // Verifica pasta
    if (!fs.existsSync(PASTA_DOCS)) {
        console.error(`❌ Pasta não encontrada: ${PASTA_DOCS}`);
        return;
    }
    const arquivos = fs.readdirSync(PASTA_DOCS).filter(f => f.endsWith('.pdf'));

    for (const arquivo of arquivos) {
        console.log(`📄 Lendo: ${arquivo}`);
        const caminho = path.join(PASTA_DOCS, arquivo);
        const buffer = fs.readFileSync(caminho);

        try {
            // --- CORREÇÃO DE COMPATIBILIDADE V1.1.1 ---
            // O pdf-parse v1.1.1 exporta um módulo CommonJS.
            // O TypeScript às vezes importa como objeto { default: func } e às vezes como a função direta.
            // Essa linha resolve o conflito dinamicamente:
            const pdfParser = (typeof pdf === 'function') ? pdf : (pdf as any).default;
            
            // Agora chamamos a função segura
            const data = await pdfParser(buffer);
            const textoCompleto = data.text;
            // -------------------------------------------

            const chunks = dividirTexto(textoCompleto, 1000);
            console.log(`   ⚡ Vetorizando ${chunks.length} trechos...`);

            for (let i = 0; i < chunks.length; i++) {
                const trecho = chunks[i];
                if (!trecho || trecho.trim().length < 20) continue; 

                const output = await extractor(trecho, { pooling: 'mean', normalize: true });
                const vector = Array.from(output.data);

                await collection.add({
                    ids: [`${arquivo}_${i}`],
                    embeddings: [vector],
                    metadatas: [{ fonte: arquivo }],
                    documents: [trecho]
                });
                
                if (i % 20 === 0) process.stdout.write('.');
            }
            console.log("\n   ✅ Salvo!");

        } catch (erro) {
            console.error(`❌ Erro no arquivo ${arquivo}:`, erro);
        }
    }
    console.log("🏁 Ingestão Finalizada!");
}

function dividirTexto(texto: string, tamanho: number): string[] {
    const chunks = [];
    if (!texto) return [];
    
    // Limpeza de quebras de linha para melhorar a busca semântica
    const textoLimpo = texto.replace(/\n/g, " ").replace(/\s+/g, " ");
    
    for (let i = 0; i < textoLimpo.length; i += tamanho) {
        chunks.push(textoLimpo.slice(i, i + tamanho));
    }
    return chunks;
}

main().catch(console.error);
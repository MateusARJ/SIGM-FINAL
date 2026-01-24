import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { pipeline } from '@xenova/transformers';
import PDFParser from 'pdf2json';

// --- CONFIGURAÇÕES ---
const PASTA_DOCS = 'docs_rag';
const COLLECTION_NAME = 'bncc-docs';
const CHROMA_URL = 'http://localhost:8000';

// Inicializa cliente
const chroma = new ChromaClient({ path: CHROMA_URL });

// --- FUNÇÃO AUXILIAR PARA A NOVA LIB ---
// Transforma a leitura baseada em eventos do pdf2json em uma Promessa simples
async function lerPdfComPdf2Json(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true); // true = extrair texto puro

        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        
        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            // O pdf2json retorna o texto meio "sujo" (URL encoded), precisamos limpar
            const textoBruto = pdfParser.getRawTextContent();
            resolve(textoBruto);
        });

        pdfParser.parseBuffer(buffer);
    });
}
// --------------------------------------

async function main() {
    console.log("🚀 Iniciando ingestão com PDF2JSON (Nova Lib)...");

    // 1. Carrega IA Local
    console.log("📥 Carregando modelo de embeddings local...");
    const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');

    // 2. Prepara o Banco
    try { await chroma.deleteCollection({ name: COLLECTION_NAME }); } catch (e) { /* Ignora */ }
    const collection = await chroma.createCollection({ name: COLLECTION_NAME });

    // 3. Verifica Arquivos
    if (!fs.existsSync(PASTA_DOCS)) {
        console.error(`❌ Pasta não encontrada: ${PASTA_DOCS}`);
        return;
    }
    const arquivos = fs.readdirSync(PASTA_DOCS).filter(f => f.endsWith('.pdf'));

    // 4. Processa
    for (const arquivo of arquivos) {
        console.log(`📄 Lendo: ${arquivo}`);
        const caminho = path.join(PASTA_DOCS, arquivo);
        const buffer = fs.readFileSync(caminho);

        try {
            // Usa a nova biblioteca aqui
            const textoCompleto = await lerPdfComPdf2Json(buffer);
            
            // Chunking
            const chunks = dividirTexto(textoCompleto, 1000);
            console.log(`   ⚡ Vetorizando ${chunks.length} trechos...`);

            for (let i = 0; i < chunks.length; i++) {
                const trecho = chunks[i];
                if (!trecho || trecho.length < 20) continue; // Filtra sujeira

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
            console.error(`❌ Falha ao ler ${arquivo}:`, erro);
        }
    }
    console.log("🏁 Ingestão Finalizada!");
}

function dividirTexto(texto: string, tamanho: number): string[] {
    const chunks = [];
    if (!texto) return [];
    // Limpeza extra de quebras de linha excessivas comuns em PDFs
    const textoLimpo = texto.replace(/(\r\n|\n|\r)/gm, " ");
    
    for (let i = 0; i < textoLimpo.length; i += tamanho) {
        chunks.push(textoLimpo.slice(i, i + tamanho));
    }
    return chunks;
}

main().catch(console.error);
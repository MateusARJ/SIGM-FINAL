import path from 'path'

import { DocumentLoader } from '../ingestion/loader/documentLoader'
import { TextChunker } from '../ingestion/chunking/textChunker'
import { KnowledgeIngestionService } from '../ingestion/ingestionKnowledgeBase'
import { InMemoryVectorStore } from '../store/InMemoryVectorStore'
import { GeminiEmbeddingService } from '../core/embedding/geminiEmbeddingService'

/**
 * Responsável por:
 * - Carregar documentos pedagógicos
 * - Ingerir no banco vetorial
 * - Retornar o VectorStore pronto para uso
 *
 * Executado UMA vez no boot da aplicação.
 */
export class RagBootstrap {

  static async initialize(): Promise<InMemoryVectorStore> {
    console.log('📚 Inicializando base pedagógica (RAG)...')

    // 1️⃣ Infra básica
    const vectorStore = new InMemoryVectorStore()
    const chunker = new TextChunker()

    const apiKey = process.env.SGI_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('SGI_GEMINI_API_KEY não definida para embeddings')
    }

    const embeddingService = new GeminiEmbeddingService(apiKey)

    const ingestionService = new KnowledgeIngestionService(
      chunker,
      embeddingService,
      vectorStore
    )

    const loader = new DocumentLoader()

    // 2️⃣ Diretórios de conhecimento
    const baseDataDir = path.join(process.cwd(), 'src', 'infra', 'ai', 'data')

    const bnccDir = path.join(baseDataDir, 'bncc')
    const mecDir = path.join(baseDataDir, 'mec')
    const outrosDir = path.join(baseDataDir, 'outros')

    // 🔎 Debug opcional (recomendo manter enquanto testa)
    console.log('📂 Diretório base de dados:', baseDataDir)
    console.log('📂 BNCC:', bnccDir)
    console.log('📂 MEC:', mecDir)
    console.log('📂 OUTROS:', outrosDir)

    // 3️⃣ Carrega textos
    const bnccTexts = await loader.loadFromDirectory(bnccDir)
    const mecTexts = await loader.loadFromDirectory(mecDir)
    const outrosTexts = await loader.loadFromDirectory(outrosDir)

    // 4️⃣ Ingestão com metadata
    for (const text of bnccTexts) {
      await ingestionService.ingestDocument(text, {
        fonte: 'BNCC',
      })
    }

    for (const text of mecTexts) {
      await ingestionService.ingestDocument(text, {
        fonte: 'MEC',
      })
    }

    for (const text of outrosTexts) {
      await ingestionService.ingestDocument(text, {
        fonte: 'OUTROS',
      })
    }

    console.log('✅ Base pedagógica carregada com sucesso')
    console.log(`🧠 Total de chunks ingeridos: ${vectorStore.getAll().length}`)

    return vectorStore
  }
}
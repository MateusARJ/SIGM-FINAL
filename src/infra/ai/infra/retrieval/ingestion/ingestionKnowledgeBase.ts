// src/infra/ai/retrieval/ingestion/KnowledgeIngestionService.ts

import { TextChunker } from '../ingestion/chunking/textChunker'
import { IEmbeddingService } from '../core/interfaces/IEmbeddingService'
import { InMemoryVectorStore } from '../store/InMemoryVectorStore'
import { VectorChunk } from '../core/interfaces/IVectorChunk'
import crypto from 'crypto'

/**
 * Responsável por:
 * - Ler textos (já carregados)
 * - Gerar chunks
 * - Criar embeddings
 * - Armazenar no vector store
 */
export class KnowledgeIngestionService {

  constructor(
    private readonly chunker: TextChunker,
    private readonly embeddingService: IEmbeddingService,
    private readonly vectorStore: InMemoryVectorStore
  ) {}

  /**
   * Ingestão de um documento inteiro
   */
  async ingestDocument(
    text: string,
    metadata?: VectorChunk['metadata']
  ): Promise<void> {

    // 1. Quebra o texto
    const chunks = this.chunker.chunk(text)

    for (const chunk of chunks) {

      // 2. Gera embedding real
      const embedding = await this.embeddingService.generateEmbedding(chunk)

      // 3. Cria chunk vetorial
      const vectorChunk: VectorChunk = {
        id: crypto.randomUUID(),
        content: chunk,
        embedding,
        ...(metadata ? { metadata } : {})
      }

      // 4. Armazena
      this.vectorStore.add(vectorChunk)
    }
  }
}

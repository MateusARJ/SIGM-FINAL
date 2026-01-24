// src/infra/ai/retrieval/store/InMemoryVectorStore.ts

import { VectorChunk } from '../core/interfaces/IVectorChunk'

/**
 * Armazena vetores em memória
 * (simula Pinecone / Weaviate / Qdrant)
 */
export class InMemoryVectorStore {
  private chunks: VectorChunk[] = []

  add(chunk: VectorChunk): void {
    this.chunks.push(chunk)
  }

  getAll(): VectorChunk[] {
    return this.chunks
  }

  clear(): void {
    this.chunks = []
  }
}

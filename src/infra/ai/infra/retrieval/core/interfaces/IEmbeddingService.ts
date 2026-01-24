// src/infra/ai/retrieval/embedding/IEmbeddingService.ts

export interface IEmbeddingService {
  generateEmbedding(text: string): Promise<number[]>
}

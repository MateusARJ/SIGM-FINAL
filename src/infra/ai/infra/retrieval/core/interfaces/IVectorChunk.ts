// src/infra/ai/retrieval/core/VectorChunk.ts

export interface VectorChunk {
  id: string
  content: string
  embedding: number[]
  metadata?: {
    fonte?: string
    nivel?: 'fundamental' | 'medio'
    tema?: string
  }
}
// src/infra/ai/retrieval/embedding/GeminiEmbeddingService.ts

import { GoogleGenerativeAI } from '@google/generative-ai'
import { IEmbeddingService } from '../interfaces/IEmbeddingService'

export class GeminiEmbeddingService implements IEmbeddingService {
  private client: GoogleGenerativeAI
  private readonly model = 'text-embedding-004'

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey)
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const model = this.client.getGenerativeModel({ model: this.model })

    const result = await model.embedContent(text)

    return result.embedding.values
  }
}

import { IBnccRetriever } from './core/interfaces/IBnccRetriever'
import { GerarMaterialDTO } from '../../core/dtoAi/entradaDto'

import { InMemoryVectorStore } from './store/InMemoryVectorStore'
import { IEmbeddingService } from './core/interfaces/IEmbeddingService'
import { VectorChunk } from './core/interfaces/IVectorChunk'
import { cosineSimilarity } from './utils/cosineSimilarity'

/**
 * Retriever vetorial real (RAG em memória).
 *
 * Responsável por:
 * - gerar embedding da consulta
 * - buscar chunks relevantes no VectorStore
 * - retornar contexto textual para o prompt
 */
export class VectorBnccRetriever implements IBnccRetriever {

  // Banco vetorial em memória
  private readonly vectorStore: InMemoryVectorStore

  // Serviço de embeddings (interface, não implementação)
  private readonly embeddingService: IEmbeddingService

  // Quantidade de chunks retornados (top-k)
  private readonly topK = 3

  constructor(
    vectorStore: InMemoryVectorStore,
    embeddingService: IEmbeddingService
  ) {
    this.vectorStore = vectorStore
    this.embeddingService = embeddingService
  }

  /**
   * Recupera contexto relevante baseado nos dados da requisição.
   * Este método é chamado pelo GeminiService (IA).
   */
  async recuperarContexto(dados: GerarMaterialDTO): Promise<string> {

    // 1️⃣ Monta a consulta textual (query semântica)
    const queryText = this.buildQuery(dados)

    // 2️⃣ Gera o embedding da consulta
    const queryEmbedding = await this.embeddingService.generateEmbedding(queryText)

    // 3️⃣ Recupera todos os chunks armazenados (ingeridos no boot)
    const chunks = this.vectorStore.getAll()

    if (chunks.length === 0) {
      return `
CONTEXTO PEDAGÓGICO (RAG):

Nenhum conhecimento pedagógico foi ingerido ainda.
`.trim()
    }

    // 4️⃣ Calcula similaridade vetorial
    const rankedChunks = chunks.map(chunk => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))

    // 5️⃣ Ordena por relevância
    rankedChunks.sort((a, b) => b.score - a.score)

    // 6️⃣ Seleciona os top-K chunks
    const selectedChunks = rankedChunks
      .slice(0, this.topK)
      .map(item => item.chunk)

    // 7️⃣ Formata o contexto final
    return this.formatContext(selectedChunks)
  }

  /**
   * Cria a query textual usada para busca vetorial.
   * NÃO é prompt, é texto para embedding.
   */
  private buildQuery(dados: GerarMaterialDTO): string {
    return `
BNCC
Disciplina: ${dados.disciplina}
Ano/Série: ${dados.ano}
Tema: ${dados.tema}
Nível de ensino: ${dados.nivel}
`.trim()
  }

  /**
   * Formata os chunks recuperados para inserção no prompt.
   */
  private formatContext(chunks: VectorChunk[]): string {
    const textos = chunks.map((chunk, index) => {
      return `
Trecho ${index + 1}:
${chunk.content}
`.trim()
    })

    return `
CONTEXTO PEDAGÓGICO (RAG - VETORIAL):

${textos.join('\n\n')}
`.trim()
  }
}

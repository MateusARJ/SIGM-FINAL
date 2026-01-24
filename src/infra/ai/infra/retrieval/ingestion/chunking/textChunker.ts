// src/infra/ai/retrieval/chunking/TextChunker.ts

/**
 * Responsável por:
 * - Quebrar textos longos em partes menores
 * - Evitar estourar limite de contexto da IA
 */
export class TextChunker {

  /**
   * Divide um texto em chunks de tamanho fixo.
   * Usa sobreposição para manter contexto.
   */
  chunk(
    text: string,
    chunkSize = 800,
    overlap = 100
  ): string[] {
    const chunks: string[] = []

    let start = 0

    while (start < text.length) {
      const end = start + chunkSize
      const chunk = text.slice(start, end)

      chunks.push(chunk.trim())

      // Avança mantendo sobreposição
      start += chunkSize - overlap
    }

    return chunks
  }
}

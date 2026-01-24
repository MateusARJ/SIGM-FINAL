// src/infra/ai/infra/retrieval/ingestion/loader/documentLoader.ts

import fs from 'fs'
import path from 'path'

// Import correto para pdf-parse clássico
const pdfParse = require('pdf-parse')

/**
 * Carrega documentos pedagógicos
 * e extrai texto puro.
 */
export class DocumentLoader {

  /**
   * Lê todos os documentos suportados
   * dentro de um diretório.
   */
  async loadFromDirectory(dirPath: string): Promise<string[]> {
    const files = fs.readdirSync(dirPath)
    const texts: string[] = []

    for (const file of files) {
      const fullPath = path.join(dirPath, file)

      // Suporte atual: PDF
      if (file.endsWith('.pdf')) {
        const text = await this.loadPdf(fullPath)
        texts.push(text)
        console.log(`📄 PDF carregado: ${file}`)
      }
    }

    return texts
  }

  /**
   * Extrai texto de um PDF.
   */
  private async loadPdf(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath)

    // Aqui sim: função direta
    const data = await pdfParse(buffer)

    return data.text
  }
}

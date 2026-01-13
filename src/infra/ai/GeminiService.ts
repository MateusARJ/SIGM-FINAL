// src/infra/ai/GeminiService.ts
import { IAService } from '../../core/ai/iAiService'
import { GerarMaterialDTO } from '../../core/ai/dto_temp'

const apiKey = process.env.SGI_GEMINI_API_KEY

if (!apiKey) {
  throw new Error('SGI_GEMINI_API_KEY não definida no ambiente')
}



export class GeminiService implements IAService {

  async gerarPlanoAula(dados: GerarMaterialDTO): Promise<string> {
    return 'GeminiService: gerarPlanoAula ainda não implementado'
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<string> {
    return 'GeminiService: gerarAtividade ainda não implementado'
  }
}

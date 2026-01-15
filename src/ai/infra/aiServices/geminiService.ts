// src/infra/ai/GeminiService.ts
import { IAService } from '../../core/dtoAi/iAiService'
import { GerarMaterialDTO } from '../../core/dtoAi/dto'
import bncc from '../../data/bncc/bncc.json'
import { planoAulaPrompt } from './prompts/planoAulaPrompt'
import { atividadePrompt } from './prompts/atividadePrompt'

const apiKey = process.env.SGI_GEMINI_API_KEY

if (!apiKey) {
  throw new Error('SGI_GEMINI_API_KEY não definida no ambiente')
}

export class GeminiService implements IAService {

  // 🔒 Validação mínima do contrato
  private validarDTO(dados: GerarMaterialDTO): void {
    if (!dados.disciplina || !dados.ano || !dados.tema || !dados.nivel) {
      throw new Error('Dados incompletos para geração de material')
    }
  }

  async gerarPlanoAula(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    // 1️⃣ BNCC por nível
    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    // 2️⃣ Prompt final
    const promptFinal = planoAulaPrompt
      .replace('{{nivel}}', dados.nivel)
      .replace('{{disciplina}}', dados.disciplina)
      .replace('{{ano}}', dados.ano)
      .replace('{{tema}}', dados.tema)
      .replace('{{bnccRegras}}', bnccRegras)

    // 3️⃣ Retorno (mock da IA)
    return promptFinal
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    const promptFinal = atividadePrompt
      .replace('{{nivel}}', dados.nivel)
      .replace('{{disciplina}}', dados.disciplina)
      .replace('{{ano}}', dados.ano)
      .replace('{{tema}}', dados.tema)
      .replace('{{bnccRegras}}', bnccRegras)

    return promptFinal
  }
}

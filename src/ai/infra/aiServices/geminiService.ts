// src/infra/ai/GeminiService.ts
import { IAService } from '../../core/dtoAi/iAiService'
import { GerarMaterialDTO } from '../../core/dtoAi/dto'
import bncc from '../../data/bncc/bncc.json'
import { planoAulaPrompt } from './prompts/planoAulaPrompt'
import { atividadePrompt } from './prompts/atividadePrompt'

export class GeminiService implements IAService {

  // 🔐 Chave da API — carregada no momento da instanciação
  // (evita erro em tempo de import e permite testes/mocks)
  private readonly apiKey: string

  constructor() {
    const apiKey = process.env.SGI_GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('SGI_GEMINI_API_KEY não definida no ambiente')
    }

    this.apiKey = apiKey
  }

  // 🔒 Validação mínima do contrato
  private validarDTO(dados: GerarMaterialDTO): void {
    if (!dados.disciplina || !dados.ano || !dados.tema || !dados.nivel) {
      throw new Error('Dados incompletos para geração de material')
    }
  }

  async gerarPlanoAula(dados: GerarMaterialDTO): Promise<string> {
    // 1️⃣ Garantia de dados válidos
    this.validarDTO(dados)

    // 2️⃣ BNCC por nível de ensino
    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    // 3️⃣ Montagem do prompt final
    const promptFinal = planoAulaPrompt
      .replace('{{nivel}}', dados.nivel)
      .replace('{{disciplina}}', dados.disciplina)
      .replace('{{ano}}', dados.ano)
      .replace('{{tema}}', dados.tema)
      .replace('{{bnccRegras}}', bnccRegras)

    // 4️⃣ Retorno (mock da IA — neste ponto ainda não chamamos a API real)
    return promptFinal
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<string> {
    // 1️⃣ Garantia de dados válidos
    this.validarDTO(dados)

    // 2️⃣ BNCC por nível de ensino
    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    // 3️⃣ Montagem do prompt final
    const promptFinal = atividadePrompt
      .replace('{{nivel}}', dados.nivel)
      .replace('{{disciplina}}', dados.disciplina)
      .replace('{{ano}}', dados.ano)
      .replace('{{tema}}', dados.tema)
      .replace('{{bnccRegras}}', bnccRegras)

    // 4️⃣ Retorno (mock da IA)
    return promptFinal
  }
}
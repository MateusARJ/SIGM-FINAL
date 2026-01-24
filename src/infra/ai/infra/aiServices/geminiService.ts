// src/infra/ai/GeminiService.ts
import 'dotenv/config';
import { IBnccRetriever } from "../retriveal/interfaces/IBnccRetriever";
import { BnccRetriever } from "../retriveal/bnccRetriever";
import { IAService } from '../../core/dtoAi/iAiService'
import { GerarMaterialDTO } from '../../core/dtoAi/entradaDto'
import bncc from '../../data/bncc/bncc.json'
import { planoAulaPrompt } from './prompts/planoAulaPrompt'
import { atividadePrompt } from './prompts/atividadePrompt'
import { provaPrompt } from './prompts/provaPrompt'
import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiService implements IAService {

  private readonly apiKey: string
  private readonly client: GoogleGenerativeAI
  private readonly modelo = 'gemini-2.5-flash'
  // 🆕 RAG - dependência do retriever
  private readonly bnccRetriever: IBnccRetriever

  constructor() {
    const apiKey = process.env.SGI_GEMINI_API_KEY

    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('SGI_GEMINI_API_KEY inválida')
    }

    console.log('✅ API Key carregada com sucesso')
    this.apiKey = apiKey
    this.client = new GoogleGenerativeAI(apiKey)

    // Instancia o Retriever Real (que conecta no Docker)
    this.bnccRetriever = new BnccRetriever()
  }

  private validarDTO(dados: GerarMaterialDTO): void {
    if (!dados.disciplina || !dados.ano || !dados.tema || !dados.nivel) {
      throw new Error('Dados incompletos para geração de material')
    }
  }

  private async chamarGemini(prompt: string): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ model: this.modelo })
      const result = await model.generateContent(prompt)
      const texto = result.response.text()
      
      if (!texto) throw new Error('Conteúdo vazio gerado pela IA')
      return texto
    } catch (error) {
      console.error('❌ Erro no Gemini:', error)
      throw error
    }
  }

  async gerarPlanoAula(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    // 1️⃣ RAG: Busca no Docker
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

    // 2️⃣ Regras estáticas
    const bnccRegras = bncc.regras_por_nivel[dados.nivel]?.join('\n') || ''

    const configAula = [
      dados.numeroSlides ? `- Slides: ${dados.numeroSlides}` : '',
      `- Imagens: ${dados.incluirImagens ? 'Sim' : 'Não'}`,
      `- Interatividade: ${dados.incluirAtividades ? 'Sim' : 'Não'}`,
      dados.estilo ? `- Estilo: ${dados.estilo}` : ''
    ].filter(Boolean).join('\n')

    // 3️⃣ Prompt Enriquecido
    // Injetamos o contextoRag no topo para dar autoridade
    const promptFinal = `
${contextoRag}

IMPORTANTE: Você deve priorizar as diretrizes do CONTEXTO OFICIAL acima ao elaborar o plano.

${planoAulaPrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      .split('{{bnccRegras}}').join(bnccRegras)
      .split('{{configAula}}').join(configAula)
      .split('{{instrucoesExtras}}').join(dados.instrucoesExtras || '')

    return this.chamarGemini(promptFinal)
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)
    const bnccRegras = bncc.regras_por_nivel[dados.nivel]?.join('\n') || ''

    const configAtividade = [
      dados.estilo ? `- Estilo: ${dados.estilo}` : '',
      dados.instrucoesExtras ? `- Obs: ${dados.instrucoesExtras}` : ''
    ].join('\n')

    const promptFinal = `
${contextoRag}
Baseie as questões nas competências citadas no CONTEXTO OFICIAL acima.

${atividadePrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      .split('{{bnccRegras}}').join(bnccRegras)
      .split('{{configAtividade}}').join(configAtividade)
      .split('{{instrucoesExtras}}').join(dados.instrucoesExtras || '')

    return this.chamarGemini(promptFinal)
  }

  async gerarProva(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)
    const bnccRegras = bncc.regras_por_nivel[dados.nivel]?.join('\n') || ''

    const configProva = [
      dados.estilo ? `- Estilo: ${dados.estilo}` : '',
      dados.instrucoesExtras ? `- Obs: ${dados.instrucoesExtras}` : ''
    ].join('\n')

    const promptFinal = `
${contextoRag}
Garanta que as questões avaliem as habilidades mencionadas no CONTEXTO OFICIAL.

${provaPrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      .split('{{bnccRegras}}').join(bnccRegras)
      .split('{{configProva}}').join(configProva)
      .split('{{instrucoesExtras}}').join(dados.instrucoesExtras || '')

    return this.chamarGemini(promptFinal)
  }
}
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

  // 🔐 Chave da API e cliente Gemini
  private readonly apiKey: string
  private readonly client: GoogleGenerativeAI
  private readonly modelo = 'gemini-2.5-flash'

  // 🆕 RAG - dependência do retriever
  private readonly bnccRetriever: IBnccRetriever

  constructor() {
    const apiKey = process.env.SGI_GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('SGI_GEMINI_API_KEY não definida no ambiente')
    }

    if (apiKey.trim().length === 0) {
      throw new Error('SGI_GEMINI_API_KEY está vazia')
    }

    console.log('✅ API Key carregada com sucesso')
    this.apiKey = apiKey
    this.client = new GoogleGenerativeAI(apiKey)

    // 🆕 RAG - instancia o mock retriever
    this.bnccRetriever = new BnccRetriever()
  }

  // 🔒 Validação mínima do contrato
  private validarDTO(dados: GerarMaterialDTO): void {
    if (!dados.disciplina || !dados.ano || !dados.tema || !dados.nivel) {
      throw new Error('Dados incompletos para geração de material')
    }
  }

  // 🤖 Método privado para chamar a API Gemini usando SDK
  private async chamarGemini(prompt: string): Promise<string> {
    try {
      console.log('🔑 Chave carregada:', this.apiKey.substring(0, 10) + '...')
      console.log('📦 Modelo:', this.modelo)
      
      const model = this.client.getGenerativeModel({
        model: this.modelo
      })

      console.log('🚀 Chamando API Gemini com SDK...')
      const result = await model.generateContent(prompt)
      
      console.log('✅ Resposta recebida da API')
      const texto = result.response.text()
      
      if (!texto) {
        throw new Error('Nenhum conteúdo foi gerado pela IA')
      }

      return texto
    } catch (error) {
      console.error('❌ Erro ao chamar API Gemini:', error)
      throw error
    }
  }

  async gerarPlanoAula(dados: GerarMaterialDTO): Promise<string> {
    // 1️⃣ Garantia de dados válidos
    this.validarDTO(dados)

    // 🆕 RAG - recupera contexto externo
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

    // 2️⃣ BNCC por nível de ensino (regra local continua)
    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    // 3️⃣ Configurações específicas da aula
    const configAula = [
      dados.numeroSlides ? `- Número de slides: ${dados.numeroSlides}` : '',
      `- Incluir imagens: ${dados.incluirImagens !== false ? 'Sim' : 'Não'}`,
      `- Incluir atividades interativas: ${dados.incluirAtividades !== false ? 'Sim' : 'Não'}`,
      dados.estilo ? `- Estilo de aula: ${dados.estilo}` : ''
    ].filter(Boolean).join('\n')

    const instrucoesExtras = dados.instrucoesExtras
      ? `\nInstruções específicas do professor:\n${dados.instrucoesExtras}`
      : ''

    // 4️⃣ Montagem do prompt final (RAG ANTES do prompt base)
    const promptFinal = `
${contextoRag}

${planoAulaPrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      .split('{{bnccRegras}}').join(bnccRegras)
      .split('{{configAula}}').join(configAula)
      .split('{{instrucoesExtras}}').join(instrucoesExtras)

    // 5️⃣ Chamar API Gemini
    return this.chamarGemini(promptFinal)
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    // 🆕 RAG
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    const configAtividade = [
      dados.estilo ? `- Estilo: ${dados.estilo}` : '',
      dados.instrucoesExtras ? `- Observações: ${dados.instrucoesExtras}` : ''
    ].filter(Boolean).join('\n')

    const instrucoesExtras = dados.instrucoesExtras
      ? `\nInstruções específicas do professor:\n${dados.instrucoesExtras}`
      : ''

    const promptFinal = `
${contextoRag}

${atividadePrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      .split('{{bnccRegras}}').join(bnccRegras)
      .split('{{configAtividade}}').join(configAtividade)
      .split('{{instrucoesExtras}}').join(instrucoesExtras)

    return this.chamarGemini(promptFinal)
  }

  async gerarProva(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    // 🆕 RAG
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

    const bnccRegras = bncc.regras_por_nivel[dados.nivel].join('\n')

    const configProva = [
      dados.estilo ? `- Estilo de prova: ${dados.estilo}` : '',
      dados.instrucoesExtras ? `- Observações: ${dados.instrucoesExtras}` : ''
    ].filter(Boolean).join('\n')

    const instrucoesExtras = dados.instrucoesExtras
      ? `\nInstruções específicas do professor:\n${dados.instrucoesExtras}`
      : ''

    const promptFinal = `
${contextoRag}

${provaPrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      .split('{{bnccRegras}}').join(bnccRegras)
      .split('{{configProva}}').join(configProva)
      .split('{{instrucoesExtras}}').join(instrucoesExtras)

    return this.chamarGemini(promptFinal)
  }
}

// src/infra/ai/GeminiService.ts
import 'dotenv/config'
import { IBnccRetriever } from "../retrieval/core/interfaces/IBnccRetriever"
import { IAService } from '../../core/dtoAi/iAiService'
import { GerarMaterialDTO } from '../../core/dtoAi/entradaDto'
import { planoAulaPrompt } from './prompts/planoAulaPrompt'
import { atividadePrompt } from './prompts/atividadePrompt'
import { provaPrompt } from './prompts/provaPrompt'
import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiService implements IAService {

  // 🔐 Chave da API e cliente Gemini
  private readonly apiKey: string
  private readonly client: GoogleGenerativeAI
  private readonly modelo = 'gemini-2.5-flash'

  // 🆕 RAG - dependência injetada no boot
  private readonly bnccRetriever: IBnccRetriever

  constructor(bnccRetriever: IBnccRetriever) {
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

    // 🆕 RAG - recebe o retriever já inicializado
    this.bnccRetriever = bnccRetriever
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

    // 🆕 RAG - recupera contexto real dos PDFs (BNCC + MEC)
    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

    // 2️⃣ Configurações específicas da aula
    const configAula = [
      dados.numeroSlides ? `- Número de slides: ${dados.numeroSlides}` : '',
      `- Incluir imagens: ${dados.incluirImagens !== false ? 'Sim' : 'Não'}`,
      `- Incluir atividades interativas: ${dados.incluirAtividades !== false ? 'Sim' : 'Não'}`,
      dados.estilo ? `- Estilo de aula: ${dados.estilo}` : ''
    ].filter(Boolean).join('\n')

    const instrucoesExtras = dados.instrucoesExtras
      ? `\nInstruções específicas do professor:\n${dados.instrucoesExtras}`
      : ''

    // 3️⃣ Montagem do prompt final (RAG antes do prompt base)
    const promptFinal = `
  ${contextoRag}

  ${planoAulaPrompt}
`
      .split('{{nivel}}').join(dados.nivel)
      .split('{{disciplina}}').join(dados.disciplina)
      .split('{{ano}}').join(dados.ano)
      .split('{{tema}}').join(dados.tema)
      // BNCC agora vem somente do RAG
      .split('{{bnccRegras}}').join('Utilize exclusivamente as diretrizes presentes no contexto fornecido acima.')
      .split('{{configAula}}').join(configAula)
      .split('{{instrucoesExtras}}').join(instrucoesExtras)

    return this.chamarGemini(promptFinal)
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

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
      .split('{{bnccRegras}}').join('Utilize exclusivamente as diretrizes presentes no contexto fornecido acima.')
      .split('{{configAtividade}}').join(configAtividade)
      .split('{{instrucoesExtras}}').join(instrucoesExtras)

    return this.chamarGemini(promptFinal)
  }

  async gerarProva(dados: GerarMaterialDTO): Promise<string> {
    this.validarDTO(dados)

    const contextoRag = await this.bnccRetriever.recuperarContexto(dados)

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
      .split('{{bnccRegras}}').join('Utilize exclusivamente as diretrizes presentes no contexto fornecido acima.')
      .split('{{configProva}}').join(configProva)
      .split('{{instrucoesExtras}}').join(instrucoesExtras)

    return this.chamarGemini(promptFinal)
  }
}

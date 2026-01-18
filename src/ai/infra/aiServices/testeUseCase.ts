import 'dotenv/config'
import { GeminiService } from './geminiService'
import { GerarConteudoUseCase } from '../../core/useCases/gerarConteudoUseCase'

const ia = new GeminiService()
const useCase = new GerarConteudoUseCase(ia)

async function testar() {
  const resposta = await useCase.gerarPlano({
    disciplina: 'História',
    ano: '9º ano',
    tema: 'Cultura Digital',
    nivel: 'fundamental'
  })

  console.log(resposta)
}

testar()
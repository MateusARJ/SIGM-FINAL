// src/infra/ai/testeGemini.ts
import 'dotenv/config'
import { GeminiService } from "./geminiService"
import { GerarMaterialDTO } from "../../core/dtoAi/dto"

async function testarIA() {
  const ia = new GeminiService()

  const dados: GerarMaterialDTO = {
    disciplina: 'História',
    ano: '9º ano',
    tema: 'Cultura Digital',
    nivel: 'fundamental'
  }

  const plano = await ia.gerarPlanoAula(dados)
  const atividade = await ia.gerarAtividade(dados)

  console.log('===== PLANO DE AULA =====')
  console.log(plano)

  console.log('\n===== ATIVIDADE =====')
  console.log(atividade)
}

testarIA()
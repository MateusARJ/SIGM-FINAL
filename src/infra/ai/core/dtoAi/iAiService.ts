// src/core/ai/IAService.ts

import { GerarMaterialDTO } from './entradaDto'

// Contrato da IA
export interface IAService {

  // Gera um plano de aula alinhado à BNCC
  gerarPlanoAula(dados: GerarMaterialDTO): Promise<string>

  // Gera uma atividade avaliativa alinhada à BNCC
  gerarAtividade(dados: GerarMaterialDTO): Promise<string>

  // Gera uma prova alinhada à BNCC
  gerarProva(dados: GerarMaterialDTO): Promise<string>
}

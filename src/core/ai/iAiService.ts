// src/core/ai/IAService.ts

import { GerarMaterialDTO } from './dto_temp'

// Contrato da IA
export interface IAService {

  // Gera um plano de aula alinhado à BNCC
  gerarPlanoAula(dados: GerarMaterialDTO): Promise<string>

  // Gera uma atividade avaliativa alinhada à BNCC
  gerarAtividade(dados: GerarMaterialDTO): Promise<string>
}

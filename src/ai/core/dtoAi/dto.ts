// src/core/ai/dto.ts

// Define os níveis de ensino aceitos pelo sistema
export type NivelEnsino = 'fundamental' | 'medio'

// DTO principal para geração de materiais didáticos via IA
export interface GerarMaterialDTO {
  disciplina: string   // Ex: "História"
  ano: string          // Ex: "9º ano"
  tema: string         // Ex: "Cultura Digital"
  nivel: NivelEnsino   // Fundamental ou Médio
}

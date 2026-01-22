// src/core/ai/dto.ts

// Define os níveis de ensino aceitos pelo sistema
export type NivelEnsino = 'fundamental' | 'medio'

// DTO principal para geração de materiais didáticos via IA
export interface GerarMaterialDTO {
  disciplina: string   // Ex: "História"
  ano: string          // Ex: "9º ano"
  tema: string         // Ex: "Cultura Digital"
  nivel: NivelEnsino   // Fundamental ou Médio
  
  // Configurações específicas por tipo de conteúdo
  instrucoesExtras?: string        // Instruções customizadas do usuário
  numeroSlides?: number            // Para aulas
  incluirImagens?: boolean         // Para aulas
  incluirAtividades?: boolean      // Para aulas
  estilo?: string                  // Ex: "minimalista", "criativo", "tradicional"
}

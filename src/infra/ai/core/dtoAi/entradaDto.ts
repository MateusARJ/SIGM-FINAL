// src/core/ai/dto.ts

// ============================================
// TIPOS BÁSICOS
// ============================================

// Define os níveis de ensino aceitos pelo sistema.
// Essa informação influencia regras pedagógicas
// e o contexto enviado para a IA.
export type NivelEnsino = 'fundamental' | 'medio'

// ============================================
// DTO PRINCIPAL – CAMADA DE IA
// ============================================

/**
 * GerarMaterialDTO
 * ----------------
 * Objeto final enviado para a camada de IA (Gemini).
 *
 * REGRAS IMPORTANTES:
 * - A IA NUNCA deve receber IDs (UUIDs)
 * - Todos os campos aqui são valores SEMÂNTICOS (strings, números, flags)
 * - Campos são opcionais porque dependem do tipo de conteúdo
 *   (aula | prova | tarefa)
 */
export interface GerarMaterialDTO {
  // ==========================================
  // DADOS PEDAGÓGICOS ESSENCIAIS (OBRIGATÓRIOS)
  // ==========================================

  disciplina: string   // Ex: "História"
  ano: string          // Ex: "9º ano"
  tema: string         // Ex: "Cultura Digital"
  nivel: NivelEnsino   // "fundamental" | "medio"

  // ==========================================
  // CONFIGURAÇÕES GERAIS (OPCIONAIS)
  // ==========================================

  // Instruções livres passadas pelo usuário
  // (ex: "explique com exemplos do cotidiano")
  instrucoesExtras?: string

  // ==========================================
  // CONFIGURAÇÕES PARA AULA (PPT / PLANO DE AULA)
  // Usadas SOMENTE quando tipoConteudo === "aula"
  // ==========================================

  numeroSlides?: number        // Quantidade de slides desejada
  incluirImagens?: boolean    // Se deve sugerir imagens
  incluirAtividades?: boolean // Se deve incluir atividades interativas
  estilo?: string             // Ex: "minimalista", "criativo", "tradicional"

  // ==========================================
  // CONFIGURAÇÕES PARA PROVA (PDF)
  // Usadas SOMENTE quando tipoConteudo === "prova"
  // ==========================================

  numeroQuestoes?: number
  tiposQuestao?: (
    | "objetiva"
    | "dissertativa"
    | "verdadeiroFalso"
  )[]
  nivelDificuldade?: "fácil" | "médio" | "difícil"
  incluirGabarito?: boolean

  // ==========================================
  // CONFIGURAÇÕES PARA TAREFA (PDF)
  // Usadas SOMENTE quando tipoConteudo === "tarefa"
  // ==========================================

  numeroExercicios?: number
  incluirExemplos?: boolean
  prazoEntrega?: Date | string
}
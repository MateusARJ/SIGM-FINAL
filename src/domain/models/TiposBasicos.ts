// ============================================
// TIPOS BÁSICOS (Union Types)
// ============================================

// Níveis de ensino
export type AnoOuSerie = 
  | "1º Ano" 
  | "2º Ano" 
  | "3º Ano" 
  | "4º Ano" 
  | "5º Ano" 
  | "6º Ano" 
  | "7º Ano" 
  | "8º Ano" 
  | "9º Ano" 
  | "1ª Série" 
  | "2ª Série" 
  | "3ª Série"
  ;

// Status de geração do conteúdo
export type StatusConteudo = "pendente" | "gerando" | "concluido" | "erro";
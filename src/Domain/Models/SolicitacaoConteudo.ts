import type { 
  DadosComuns, 
  ConfiguracaoAula, 
  ConfiguracaoProva, 
  ConfiguracaoTarefa 
} from "../interfaces/IConfiguracaoConteudo";

// ============================================
// MODELO (Solicitação de Conteúdo)
// ============================================

/**
 * Tipo que representa uma solicitação de geração de conteúdo.
 * Combina os dados comuns com as configurações específicas
 * para cada tipo de conteúdo (aula, prova, tarefa).
 */
export type SolicitacaoConteudo = DadosComuns & (
  | ConfiguracaoAula
  | ConfiguracaoProva
  | ConfiguracaoTarefa
);
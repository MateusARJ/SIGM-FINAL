import { 
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

// exemplo do body da solicitação de conteúdo:
 
/*
{
  "id": "req-123",
  "disciplinaId": "mat-001",
  "anoLetivo": "8º Ano",
  "assunto": "Equações de Segundo Grau",
  "tipoConteudo": "aula", // "aula" | "prova" | "tarefa"
  "instrucoesExtras": "Focar em exemplos práticos e contextualizados.",
  // Configurações específicas para "aula"
  "numeroSlides": 15,
  "incluirImagens": true,
  "incluirAtividades": true,
  "estilo": "criativo"
}

{
  "id": "req-124",
  "disciplinaId": "port-002",
  "anoLetivo": "9º Ano",
  "assunto": "Interpretação de Texto",
  "tipoConteudo": "prova", // "aula" | "prova" | "tarefa"
  // Configurações específicas para "prova"
  "numeroQuestoes": 10,
  "tiposQuestao": ["objetiva", "dissertativa"],
  "nivelDificuldade": "médio",
  "incluirGabarito": true
}

{
  "id": "req-125",
  "disciplinaId": "hist-003",
  "anoLetivo": "7º Ano",
  "assunto": "Revolução Industrial",
  "tipoConteudo": "tarefa", // "aula" | "prova" | "tarefa"
  // Configurações específicas para "tarefa"
  "numeroExercicios": 5,
  "incluirExemplos": true,
  "prazoEntrega": "2023-12-31T23:59:59Z"
}
*/

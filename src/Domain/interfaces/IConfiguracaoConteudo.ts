import type { AnoOuSerie, TipoConteudo } from "../Models/TiposBasicos";

// ============================================
// INTERFACES (Objetos Complexos)
// ============================================

//

export interface anoLetivo {
    ano: AnoOuSerie;
    disciplinas: Array<Disciplina>;
}

export interface Disciplina {
  id: string;
  nome: string;
  assuntos: Array<Assunto>;
}

export interface Assunto {
  id: string;
  nome: string;
  disciplinaID: string;
  anoLetivo: AnoOuSerie;
}

/**
 * Interfaces para configuração do modelo de requisição para a IA
 */

export interface DadosComuns {
  id: string;
  disciplinaId: string;
  anoLetivo: string;    
  assunto: string;     
  instrucoesExtras?: string; 
}

// Configurações para geração de aula (PPT)
export interface ConfiguracaoAula {
  numeroSlides?: number; // * caso possua obrigatório ser maior que 0
  incluirImagens?: boolean; 
  incluirAtividades?: boolean; 
  estilo?: | "minimalista" | "profissional" | "colorido" | "criativo"; // * caso não informado, padrão "minimalista"
}

// Configurações para geração de prova (PDF)
export interface ConfiguracaoProva {
  numeroQuestoes: number;
  tiposQuestao: ("objetiva" | "dissertativa" | "verdadeiroFalso")[];
  nivelDificuldade: "fácil" | "médio" | "difícil";
  incluirGabarito: boolean;
}

// Configurações para geração de tarefa (PDF)
export interface ConfiguracaoTarefa {
  numeroExercicios: number;
  incluirExemplos?: boolean;
  prazoEntrega?: Date;
}
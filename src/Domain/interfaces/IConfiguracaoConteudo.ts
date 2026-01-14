import type { AnoOuSerie, NomeDisciplina, TipoConteudo } from "../Models/TiposBasicos";

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
  nome: NomeDisciplina;
  Assuntos: Array<Assunto>;
}

export interface Assunto {
  id: string;
  nome: string;
  disciplina: Disciplina;
  anoLetivo: AnoOuSerie;
}

/**
 * interfaces para configuração de geração de conteúdo
 */

export interface DadosComuns {
  disciplinaId: string; // ID da disciplina do banco
  anoLetivo: string;    // Ex: "9º Ano"
  assunto: string;      // Ex: "Revolução Industrial"
  instrucoesExtras?: string; // O professor digita: "Foque na máquina a vapor"
}

// Configurações para geração de aula (PPT)
export interface ConfiguracaoAula {
  numeroSlides?: number;
  incluirImagens: boolean;
  incluirAtividades: boolean;
  estilo?: | "minimalista" | "profissiona" | "colorido" | "criativo";
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
  incluirExemplos: boolean;
  prazoEntrega?: Date;
}
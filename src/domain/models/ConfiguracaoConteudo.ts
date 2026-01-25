import type { AnoOuSerie } from "./TiposBasicos";

// ============================================
// INTERFACES (Objetos Complexos)
// ============================================

//

export interface AnoLetivo {
    serieId: string;
    nome: AnoOuSerie;
    disciplinas: Array<Disciplina>;
}

export interface Disciplina {
  id: string;
  serieId: string;
  nome: string;
  assuntos: Array<Assunto>;
}

export interface Assunto {
  id: string;
  nome: string;
  disciplinaID: string;
}

/**
 * Interfaces para configuração do modelo de requisição para a IA
 */

export interface DadosComuns {
  // retirado id da solicitação (já que requestId está em RegistroConteudo)

  // dados tipo chave estrangeira para BD 

  serieId: string
  disciplinaId: string;
  assuntoId: string;

  //

  anoLetivo: string;    
  assuntoTitulo: string;     
  instrucoesExtras?: string; 
}

// Configurações para geração de aula (PPT)
export interface ConfiguracaoAula {
  tipoConteudo: 'aula'; // <--- O "Discriminador"
  numeroSlides?: number; // * caso possua obrigatório ser maior que 0
  incluirImagens?: boolean; 
  incluirAtividades?: boolean; 
  estilo?: | "minimalista" | "profissional" | "colorido" | "criativo"; // * caso não informado, padrão "minimalista"
}

// Configurações para geração de prova (PDF)
export interface ConfiguracaoProva {
  tipoConteudo: 'prova'; // <--- O "Discriminador"
  numeroQuestoes: number;
  tiposQuestao: ("objetiva" | "dissertativa" | "verdadeiroFalso")[];
  nivelDificuldade: "fácil" | "médio" | "difícil";
  incluirGabarito: boolean;
}

// Configurações para geração de tarefa (PDF)
export interface ConfiguracaoTarefa {
  tipoConteudo: 'tarefa'; // <--- O "Discriminador"
  numeroExercicios: number;
  incluirExemplos?: boolean;
  prazoEntrega?: Date | string; // *adicionado tipo string para evitar problemas de compatibilidade
}
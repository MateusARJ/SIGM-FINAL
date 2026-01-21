export interface CriarConteudoDTO {
  serieId: string;
  disciplinaId: string;
  assuntoId: string;

  anoLetivo: string;
  assuntoTitulo: string;

  tipoConteudo: 'aula' | 'prova' | 'tarefa';

  instrucoesExtras?: string;

  // campos variáveis
  numeroSlides?: number;
  incluirImagens?: boolean;
  incluirAtividades?: boolean;
  estilo?: string;

  numeroQuestoes?: number;
  tiposQuestao?: string[];
  nivelDificuldade?: string;
  incluirGabarito?: boolean;

  numeroExercicios?: number;
  incluirExemplos?: boolean;
  prazoEntrega?: string;
}

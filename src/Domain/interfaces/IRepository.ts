import type { Assunto, Disciplina, anoLetivo } from "./IConfiguracaoConteudo";
import { SolicitacaoConteudo, RegistroConteudo } from "../Models/RequisicaoModelo";

// ============================================
// INTERFACES (Repositório)
// ============================================

export interface IRepository {

    // Métodos para Disciplina
    addDisciplina(disciplina: Disciplina): Promise<void>;
    getDisciplinaById(id: string): Promise<Disciplina | undefined>;
    getDisciplinaByName(name: string): Promise<Disciplina | undefined>;
    getAllDisciplinas(): Promise<Disciplina[]>;
    updateDisciplina(disciplina: Disciplina): Promise<void>;
    deleteDisciplina(id: string): Promise<void>;

    // Métodos para Assunto
    addAssunto(assunto: Assunto): Promise<void>;
    getAssuntoById(id: string): Promise<Assunto | undefined>;
    getAssuntosByDisciplina(disciplinaId: string): Promise<Assunto[]>;
    getAllAssuntos(): Promise<Assunto[]>;
    updateAssunto(assunto: Assunto): Promise<void>;
    deleteAssunto(id: string): Promise<void>;

    // Metodo para armazenar respostas de geração de conteúdo

    // ideia: adicionar tags para as respostas gerados como forma de aprimorar a pesquisa (colocando tag como requisito opcional da pesquisa
    salvarConteudorResultado(conteudo: any): Promise<string>;
    buscarConteudoPorId(requestId: string): Promise<RegistroConteudo>;
    atualizarConteudo(conteudo: any): Promise<string>;
    removerConteudo(requestId: string): Promise<string>;
    verificarStatusGeracao(requestId: string): Promise<string>;
    

}

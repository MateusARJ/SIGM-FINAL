import type { Assunto, Disciplina, AnoLetivo } from "./IConfiguracaoConteudo"; // Nota: Ajustei para AnoLetivo (Maiúscula) que é o padrão de Types
import { SolicitacaoConteudo, RegistroConteudo } from "../models/RequisicaoModelo";

// ============================================
// INTERFACES (Repositório)
// ============================================

export interface IRepository {

    // ========================
    // MÉTODOS PARA DISCIPLINA
    // ========================
    addDisciplina(disciplina: Disciplina): Promise<void>;
    getDisciplinaById(id: string): Promise<Disciplina | undefined>;
    getDisciplinaByName(name: string): Promise<Disciplina | undefined>;
    getAllDisciplinas(): Promise<Disciplina[]>;
    updateDisciplina(disciplina: Disciplina): Promise<void>;
    deleteDisciplina(id: string): Promise<void>;

    // ========================
    // MÉTODOS PARA ANO LETIVO (Adicionados)
    // ========================
    addAnoLetivo(anoLetivo: AnoLetivo): Promise<void>;
    getAnoLetivoById(id: string): Promise<AnoLetivo | undefined>;
    getAnoLetivoByName(name: string): Promise<AnoLetivo | undefined>;
    getAllAnoLetivos(): Promise<AnoLetivo[]>;
    updateAnoLetivo(anoLetivo: AnoLetivo): Promise<void>;
    deleteAnoLetivo(id: string): Promise<void>;

    // ========================
    // MÉTODOS PARA ASSUNTO
    // ========================
    addAssunto(assunto: Assunto): Promise<void>;
    getAssuntoById(id: string): Promise<Assunto | undefined>;
    getAssuntosByDisciplina(disciplinaId: string): Promise<Assunto[]>;
    getAllAssuntos(): Promise<Assunto[]>;
    updateAssunto(assunto: Assunto): Promise<void>;
    deleteAssunto(id: string): Promise<void>;

    // ========================
    // CONTEÚDO GERADO (IA)
    // ========================
    salvarConteudoResultado(conteudo: any): Promise<string>;
    buscarConteudoPorId(requestId: string): Promise<RegistroConteudo | undefined>; // Ajustei retorno para undefined caso não ache
    atualizarConteudo(conteudo: any): Promise<string>;
    removerConteudo(requestId: string): Promise<string>;
    verificarStatusGeracao(requestId: string): Promise<string>;
}
import type { Assunto, Disciplina, anoLetivo } from "./IConfiguracaoConteudo";

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

    // ideia: adicionar tags para as respostas gerados como forma de aprimorar a pesquisa (colocando tag como requisito opcional da pesquisa)
    saveGeneratedContentResponse(requestId: string, contentUrl: string): Promise<void>;
    updateGeneratedContentResponse(requestId: string, contentUrl: string): Promise<void>;
    getGeneratedContentResponseById(requestId: string): Promise<string | undefined>;
    deleteGeneratedContentResponse(requestId: string): Promise<void>;
    searchGeneratedContentResponses(keyword: string): Promise<Array<{ requestId: string; contentUrl: string }>>;

}

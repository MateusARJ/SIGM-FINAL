import type { IRepository } from "../interfaces/IRepository";
import type { Assunto, Disciplina } from "../interfaces/IConfiguracaoConteudo";
import { RegistroConteudo } from "../Models/RequisicaoModelo";

export class InMemoryRepository implements IRepository {
    // Simulando o Banco de Dados com Maps (Chave -> Valor)
    private disciplinas: Map<string, Disciplina> = new Map();
    private assuntos: Map<string, Assunto> = new Map();
    private generatedContents: Map<string, RegistroConteudo> = new Map();

    // ========================
    // DISCIPLINA
    // ========================

    async addDisciplina(disciplina: Disciplina): Promise<void> {
        this.disciplinas.set(disciplina.id, disciplina);
    }

    async getDisciplinaById(id: string): Promise<Disciplina | undefined> {
        return this.disciplinas.get(id);
    }

    async getDisciplinaByName(name: string): Promise<Disciplina | undefined> {
        const normalized = name.toLowerCase().trim();

        for (const disciplina of this.disciplinas.values()) {
            if (disciplina.nome.toLowerCase() === normalized) {
                return disciplina;
            }
        }

        return undefined;
    }

    async getAllDisciplinas(): Promise<Disciplina[]> {
        return Array.from(this.disciplinas.values());
    }

    async updateDisciplina(disciplina: Disciplina): Promise<void> {
        if (!this.disciplinas.has(disciplina.id)) {
            throw new Error("Disciplina não encontrada");
        }
        this.disciplinas.set(disciplina.id, disciplina);
    }

    async deleteDisciplina(id: string): Promise<void> {
        this.disciplinas.delete(id);
    }

    // ========================
    // ASSUNTO
    // ========================
    async addAssunto(assunto: Assunto): Promise<void> {
        this.assuntos.set(assunto.id, assunto);
    }

    async getAssuntoById(id: string): Promise<Assunto | undefined> {
        return this.assuntos.get(id);
    }

    async getAssuntosByDisciplina(disciplinaId: string): Promise<Assunto[]> {
        // Filtro manual (simulando um WHERE do SQL)
        return Array.from(this.assuntos.values())
            .filter(a => a.disciplinaID === disciplinaId);
    }

    async getAllAssuntos(): Promise<Assunto[]> {
        return Array.from(this.assuntos.values());
    }

    async updateAssunto(assunto: Assunto): Promise<void> {
        this.assuntos.set(assunto.id, assunto);
    }

    async deleteAssunto(id: string): Promise<void> {
        this.assuntos.delete(id);
    }

    // ========================
    // CONTEÚDO GERADO
    // ========================
    async salvarConteudorResultado(conteudo: any): Promise<string> {
        this.generatedContents.set(conteudo.requestId, conteudo);
        return conteudo.requestId;
    }
    async buscarConteudoPorId(requestId: string): Promise<any | undefined> {
        return this.generatedContents.get(requestId);
    }
    async atualizarConteudo(conteudo: any): Promise<string> {
        this.generatedContents.set(conteudo.requestId, conteudo);
        return conteudo.requestId;
    }
    async removerConteudo(requestId: string): Promise<string> {
        this.generatedContents.delete(requestId);
        return requestId;
    }
    async verificarStatusGeracao(requestId: string): Promise<string> {
        const conteudo = this.generatedContents.get(requestId);
        if (!conteudo) throw new Error("Não encontrado");
        return conteudo.status;
    }

}
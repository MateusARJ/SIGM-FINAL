import type { IRepository } from "../Domain/interfaces/IRepository"; 
import type { Assunto, Disciplina } from "../Domain/interfaces/IConfiguracaoConteudo";

export class InMemoryRepository implements IRepository {
    // Simulando o Banco de Dados com Maps (Chave -> Valor)
    private disciplinas: Map<string, Disciplina> = new Map();
    private assuntos: Map<string, Assunto> = new Map();
    private generatedContents: Map<string, { requestId: string; contentUrl: string }> = new Map();

    // ========================
    // DISCIPLINA
    // ========================
    async addDisciplina(disciplina: Disciplina): Promise<void> {
        this.disciplinas.set(disciplina.id, disciplina);
        console.log(`[DB] Disciplina salva: ${disciplina.nome}`);
    }

    async getDisciplina(id: string): Promise<Disciplina | undefined> {
        return this.disciplinas.get(id);
    }

    async getAllDisciplinas(): Promise<Disciplina[]> {
        return Array.from(this.disciplinas.values());
    }

    async updateDisciplina(disciplina: Disciplina): Promise<void> {
        if (this.disciplinas.has(disciplina.id)) {
            this.disciplinas.set(disciplina.id, disciplina);
        }
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

    async getAssunto(id: string): Promise<Assunto | undefined> {
        return this.assuntos.get(id);
    }

    async getAssuntosByDisciplina(disciplinaId: string): Promise<Assunto[]> {
        // Filtro manual (simulando um WHERE do SQL)
        return Array.from(this.assuntos.values())
            .filter(a => a.id === disciplinaId);
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
    async saveGeneratedContentResponse(requestId: string, contentUrl: string): Promise<void> {
        this.generatedContents.set(requestId, { requestId, contentUrl });
    }

    async updateGeneratedContentResponse(requestId: string, contentUrl: string): Promise<void> {
        this.generatedContents.set(requestId, { requestId, contentUrl });
    }

    async getGeneratedContentResponse(requestId: string): Promise<string | undefined> {
        const item = this.generatedContents.get(requestId);
        return item?.contentUrl;
    }

    async deleteGeneratedContentResponse(requestId: string): Promise<void> {
        this.generatedContents.delete(requestId);
    }

    async searchGeneratedContentResponses(keyword: string): Promise<Array<{ requestId: string; contentUrl: string }>> {
        // Simulação de busca "LIKE %keyword%"
        return Array.from(this.generatedContents.values())
            .filter(item => item.contentUrl.includes(keyword) || item.requestId.includes(keyword));
    }
}
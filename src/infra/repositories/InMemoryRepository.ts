import type { IRepository } from "../../domain/interfaces/IRepository"; // Ajuste o caminho conforme sua pasta
import type { Assunto, Disciplina, AnoLetivo } from "../../domain/models/ConfiguracaoConteudo";
import { RegistroConteudo } from "../../domain/models/RequisicaoModelo";

export class InMemoryRepository implements IRepository {
    // Simulando o Banco de Dados com Maps (Chave -> Valor)
    private disciplinas: Map<string, Disciplina> = new Map();
    private assuntos: Map<string, Assunto> = new Map();
    private anosLetivos: Map<string, AnoLetivo> = new Map(); // <--- Novo Map
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
    // ANO LETIVO (Implementação Nova)
    // ========================
    async addAnoLetivo(anoLetivo: AnoLetivo): Promise<void> {
        this.anosLetivos.set(anoLetivo.serieId, anoLetivo);
    }

    async getAnoLetivoById(id: string): Promise<AnoLetivo | undefined> {
        return this.anosLetivos.get(id);
    }

    async getAnoLetivoByName(name: string): Promise<AnoLetivo | undefined> {
        const normalized = name.toLowerCase().trim();
        // Varre o Map procurando pelo nome (ex: "9º Ano" == "9º ano")
        for (const ano of this.anosLetivos.values()) {
            // Supondo que o objeto AnoLetivo tenha a propriedade 'descricao' ou 'ano'
            // Ajuste 'ano.descricao' para o nome real da propriedade no seu tipo
            if (ano.nome.toLowerCase() === normalized) { 
                return ano;
            }
        }
        return undefined;
    }

    async getAllAnoLetivos(): Promise<AnoLetivo[]> {
        return Array.from(this.anosLetivos.values());
    }

    async updateAnoLetivo(anoLetivo: AnoLetivo): Promise<void> {
        if (!this.anosLetivos.has(anoLetivo.serieId)) {
            throw new Error("Ano Letivo não encontrado");
        }
        this.anosLetivos.set(anoLetivo.serieId, anoLetivo);
    }

    async deleteAnoLetivo(id: string): Promise<void> {
        this.anosLetivos.delete(id);
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
        return Array.from(this.assuntos.values())
            .filter(a => a.disciplinaID === disciplinaId);
    }

    async getAllAssuntos(): Promise<Assunto[]> {
        return Array.from(this.assuntos.values());
    }

    async updateAssunto(assunto: Assunto): Promise<void> {
        if (!this.assuntos.has(assunto.id)) {
            throw new Error("Assunto não encontrado");
        }
        this.assuntos.set(assunto.id, assunto);
    }

    async deleteAssunto(id: string): Promise<void> {
        this.assuntos.delete(id);
    }

    // ========================
    // CONTEÚDO GERADO
    // ========================
    async salvarConteudoResultado(conteudo: any): Promise<string> {
        // Garantindo que requestId existe
        if (!conteudo.requestId) throw new Error("Conteúdo sem requestId");
        
        this.generatedContents.set(conteudo.requestId, conteudo);
        return conteudo.requestId;
    }

    async buscarConteudoPorId(requestId: string): Promise<RegistroConteudo | undefined> {
        return this.generatedContents.get(requestId);
    }

    async atualizarConteudo(conteudo: any): Promise<string> {
        if (!this.generatedContents.has(conteudo.requestId)) {
             throw new Error("Conteúdo para atualização não encontrado");
        }
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
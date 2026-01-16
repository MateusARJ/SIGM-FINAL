import { IRepository } from "../interfaces/IRepository";
import { Disciplina } from "../interfaces/IConfiguracaoConteudo";
import { IDisciplinaService } from "../interfaces/IDisciplinaService";
import { v4 as uuidv4 } from 'uuid';

export class DisciplinaService implements IDisciplinaService {
    private repository: IRepository;

    constructor(repository: IRepository) {
        this.repository = repository;
    }

    async list(): Promise<Disciplina[]> {
        return this.repository.getAllDisciplinas();
    }
    async get(id: string): Promise<Disciplina> {
        const disciplina = await this.repository.getDisciplinaById(id);
        if (!disciplina) {
            throw new Error(`Disciplina com ID ${id} não encontrada.`);
        }
        return disciplina;
    }
    async findByName(name: string): Promise<Disciplina | undefined> {
        return this.repository.getDisciplinaByName(name);
    }
    async create(data: Omit<Disciplina, 'id'>): Promise<Disciplina> {
        if (!data.nome || data.nome.trim() === '') {
            throw new Error("Nome da disciplina é obrigatório.");
        }
        if (data.nome.length < 3) {
            throw new Error("Nome da disciplina deve ter pelo menos 3 caracteres.");
        }

        const duplicado = await this.repository.getDisciplinaByName(data.nome);
        if (duplicado) {
            throw new Error("Já existe uma disciplina com este nome.");
        }

        const newDisciplina: Disciplina = {
            id: uuidv4(),
            ...data
        };

        await this.repository.addDisciplina(newDisciplina);
        return newDisciplina;
    }
    async update(id: string, data: Partial<Omit<Disciplina, 'id'>>): Promise<Disciplina> {
        const atual = await this.get(id); // Garante que existe

        const atualizado = {
            ...atual,
            ...data
        };

        await this.repository.updateDisciplina(atualizado);
        return atualizado;
    }
    async delete(id: string): Promise<void> {
        await this.get(id);
        await this.repository.deleteDisciplina(id);

    }

}
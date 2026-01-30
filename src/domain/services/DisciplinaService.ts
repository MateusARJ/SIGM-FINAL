import { IRepository } from "../interfaces/IRepository";
import { Disciplina } from "../models/ConfiguracaoConteudo";
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
        // 1. VALIDAÇÃO DE CAMPOS (Já existia)
        if (!data.nome || data.nome.trim() === '') {
            throw new Error("Nome da disciplina é obrigatório.");
        }

        // 2. VALIDAÇÃO DE INTEGRIDADE REFERENCIAL (O que faltava)
        // Supõe-se que seu DTO de disciplina tenha um campo 'anoLetivoId' ou 'serieId'
        if (!data.serieId) {
            throw new Error("A disciplina deve estar associada a um Ano Letivo/Série.");
        }

        const anoLetivoExiste = await this.repository.getAnoLetivoById(data.serieId);
        if (!anoLetivoExiste) {
            throw new Error("O Ano Letivo/Série informado não existe.");
        }

        // 3. VALIDAÇÃO DE DUPLICIDADE (Já existia)
        // Nota: O ideal é verificar duplicidade DENTRO do mesmo ano.
        // Ex: Pode ter "Matemática" no 8º Ano e "Matemática" no 9º Ano.
        // Mas "Matemática" duas vezes no 8º Ano não pode.

        const todasDisciplinas = await this.repository.getAllDisciplinas();
        const duplicado = todasDisciplinas.find(d =>
            d.nome.toLowerCase() === data.nome.toLowerCase() &&
            d.serieId === data.serieId
        );

        if (duplicado) {
            throw new Error(`A disciplina '${data.nome}' já existe neste Ano Letivo.`);
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

        const nomeFinal = data.nome ?? atual.nome;
        const serieFinal = data.serieId ?? atual.serieId;

        // 🔎 Verifica duplicidade (ignorando o próprio registro)
        const todas = await this.repository.getAllDisciplinas();
        const duplicado = todas.find(d =>
            d.id !== id &&
            d.nome.toLowerCase() === nomeFinal.toLowerCase() &&
            d.serieId === serieFinal
        );

        if (duplicado) {
            throw new Error(`Já existe outra disciplina '${nomeFinal}' neste Ano Letivo.`);
        }

        const atualizado: Disciplina = {
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
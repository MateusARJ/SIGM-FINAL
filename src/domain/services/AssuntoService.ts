
import { v4 as uuidv4 } from 'uuid';
import { IAssuntoService } from "../interfaces/IAssuntoService";
import { IRepository } from "../interfaces/IRepository";
import { Assunto } from "../models/ConfiguracaoConteudo";

export class AssuntoService implements IAssuntoService {

  constructor(private repository: IRepository) { }

  async list(): Promise<Assunto[]> {
    return this.repository.getAllAssuntos();
  }

  async get(id: string): Promise<Assunto> {
    const assunto = await this.repository.getAssuntoById(id);
    if (!assunto) throw new Error(`Assunto com ID ${id} não encontrado.`);
    return assunto;
  }

  async findByName(name: string): Promise<Assunto | undefined> {
    // Busca manual na lista (já que o repo genérico pode não ter filtro específico ainda)
    const all = await this.repository.getAllAssuntos();
    return all.find(a => a.nome.toLowerCase() === name.toLowerCase());
  }

  /**
  * findAssuntoByDisciplina
  * Busca todos os assuntos associados a uma disciplina específica.
  * 
  * @param disciplinaId - O ID da disciplina cujos assuntos serão buscados.
  * @returns Uma Promise que resolve para um array de objetos Assunto.
  */
  async findAssuntoByDisciplina(disciplinaId: string): Promise<Assunto[]> {
    return this.repository.getAssuntosByDisciplina(disciplinaId);
  }

  async create(data: Omit<Assunto, 'id'>): Promise<Assunto> {
    // 1. Valida se a disciplina existe (Regra de Negócio)
    const disciplina = await this.repository.getDisciplinaById(data.disciplinaID);
    if (!disciplina) {
      throw new Error("Disciplina informada não existe.");
    }

    // 2. Valida duplicidade de nome
    const duplicado = await this.existeDuplicado(data.nome, data.disciplinaID);
    if (duplicado) {
      throw new Error("Já existe um assunto com este nome.");
    }

    // 3. Cria
    const newAssunto: Assunto = {
      id: uuidv4(),
      ...data
    };

    await this.repository.addAssunto(newAssunto);
    return newAssunto;
  }

  async update(id: string, data: Partial<Omit<Assunto, 'id'>>): Promise<void> {
    const atual = await this.get(id); // Garante que existe

    const atualizado = {
      ...atual,
      ...data
    };

    await this.repository.updateAssunto(atualizado);
  }

  private async existeDuplicado(nome: string, disciplinaID: string): Promise<boolean> {
    const all = await this.repository.getAllAssuntos();

    return all.some(a =>
      a.nome.toLowerCase() === nome.toLowerCase() &&
      a.disciplinaID === disciplinaID
    );
  }


  async delete(id: string): Promise<void> {
    const deletado = await this.get(id); // Garante que existe antes de tentar deletar
    if (!deletado) {
      throw new Error(`Assunto com ID ${id} não encontrado para deleção.`);
    }
    await this.repository.deleteAssunto(id);
  }
}


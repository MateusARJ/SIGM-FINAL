
import { v4 as uuidv4 } from 'uuid';
import { IAnoLetivoService } from "../interfaces/IAnoLetivoService";
import { IRepository } from "../interfaces/IRepository";
import { AnoLetivo } from "../models/ConfiguracaoConteudo";

export class AnoLetivoService implements IAnoLetivoService {

  constructor(private repository: IRepository) { }

  async list(): Promise<AnoLetivo[]> {
    return this.repository.getAllAnoLetivos();
  }

  async get(serieId: string): Promise<AnoLetivo> {
    const AnoLetivo = await this.repository.getAnoLetivoById(serieId);
    if (!AnoLetivo) throw new Error(`AnoLetivo com ID ${serieId} não encontrado.`);
    return AnoLetivo;
  }

  async findByName(name: string): Promise<AnoLetivo | undefined> {
    // Busca manual na lista (já que o repo genérico pode não ter filtro específico ainda)
    const all = await this.repository.getAllAnoLetivos();
    return all.find(a => a.nome.toLowerCase() === name.toLowerCase());
  }

  async create(data: Omit<AnoLetivo, 'serieId'>): Promise<AnoLetivo> {

    // 2. Valida duplicidade de nome
    const duplicado = await this.findByName(data.nome);
    if (duplicado) {
      throw new Error("Já existe um AnoLetivo com este nome.");
    }

    // 3. Cria
    const newAnoLetivo: AnoLetivo = {
      serieId: uuidv4(),
      ...data
    };

    await this.repository.addAnoLetivo(newAnoLetivo);
    return newAnoLetivo;
  }

  async update(serieId: string, data: Partial<Omit<AnoLetivo, 'id'>>): Promise<void> {
    const atual = await this.get(serieId); // Garante que existe

    const nomeFinal = data.nome ?? atual.nome;

    const todos = await this.repository.getAllAnoLetivos();
    const duplicado = todos.find(a =>
      a.serieId !== serieId &&
      a.nome.toLowerCase() === nomeFinal.toLowerCase()
    );

    if (duplicado) {
      throw new Error(`Já existe outro Ano letivo '${nomeFinal}'.`);
    }

    const atualizado = {
      ...atual,
      ...data
    };

    await this.repository.updateAnoLetivo(atualizado);
  }

  async delete(serieId: string): Promise<void> {
    const deletado = await this.get(serieId); // Garante que existe antes de tentar deletar
    if (!deletado) {
      throw new Error(`Ano letivo com ID ${serieId} não encontrado para deleção.`);
    }
    await this.repository.deleteAnoLetivo(serieId);
  }
}


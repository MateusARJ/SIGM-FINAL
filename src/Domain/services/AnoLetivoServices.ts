
import { v4 as uuidv4 } from 'uuid';
import { IAnoLetivoService } from "../interfaces/IAnoLetivoService";
import { IRepository } from "../interfaces/IRepository";
import { AnoLetivo } from "../interfaces/IConfiguracaoConteudo";

export class AnoLetivoService implements IAnoLetivoService {

  constructor(private repository: IRepository) {}

  async list(): Promise<AnoLetivo[]> {
    return this.repository.getAllAnoLetivos();
  }

  async get(id: string): Promise<AnoLetivo> {
    const AnoLetivo = await this.repository.getAnoLetivoById(id);
    if (!AnoLetivo) throw new Error(`AnoLetivo com ID ${id} não encontrado.`);
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

  async update(id: string, data: Partial<Omit<AnoLetivo, 'id'>>): Promise<void> {
    const atual = await this.get(id); // Garante que existe
    
    const atualizado = {
        ...atual,
        ...data
    };

    await this.repository.updateAnoLetivo(atualizado);
  }

  async delete(id: string): Promise<void> {
    const deletado = await this.get(id); // Garante que existe antes de tentar deletar
    if (!deletado) {
      throw new Error(`Ano letivo com ID ${id} não encontrado para deleção.`);
    }
    await this.repository.deleteAnoLetivo(id);
  }
}


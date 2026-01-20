import { AnoLetivo } from "./IConfiguracaoConteudo"

export interface IAnoLetivoService {
  list(): Promise<AnoLetivo[]>
  get(id: string): Promise<AnoLetivo>
  findByName(nome: string): Promise<AnoLetivo | undefined>
  create(data: Omit<AnoLetivo, 'id'>): Promise<AnoLetivo>
  update(id: string, data: Partial<Omit<AnoLetivo, 'id'>>): Promise<void>
  delete(id: string): Promise<void>
}
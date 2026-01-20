import { Assunto } from "./IConfiguracaoConteudo"

export interface IAssuntoService {
  list(): Promise<Assunto[]>
  get(id: string): Promise<Assunto>
  findByName(nome: string): Promise<Assunto | undefined>
  create(data: Omit<Assunto, 'id'>): Promise<Assunto>
  update(id: string, data: Partial<Omit<Assunto, 'id'>>): Promise<void>
  delete(id: string): Promise<void>
}

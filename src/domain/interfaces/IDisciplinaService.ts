import { Disciplina } from "../models/ConfiguracaoConteudo";

export interface IDisciplinaService {
  list(): Promise<Disciplina[]>
  get(id: string): Promise<Disciplina>
  findByName(nome: string): Promise<Disciplina | undefined>
  create(data: Omit<Disciplina, 'id'>): Promise<Disciplina>
  update(id: string, data: Partial<Omit<Disciplina, 'id'>>): Promise<Disciplina>
  delete(id: string): Promise<void>
}
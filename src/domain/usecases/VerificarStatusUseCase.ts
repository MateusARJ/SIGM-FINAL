import { IRepository } from "../interfaces/IRepository";

export class VerificarStatusUseCase {
  constructor(private repo: IRepository) {}

  async execute(requestId: string) {
    const conteudo = await this.repo.verificarStatusGeracao(requestId);
    if (!conteudo) throw new Error("Não encontrado");
    return conteudo;
  }
}
import { IRepository } from "../interfaces/IRepository";
import { IIAClient } from "../interfaces/IIAClienteService";

export class ObterConteudoUseCase {
  constructor(private repo: IRepository) {}

  async execute(requestId: string) {
    const conteudo = await this.repo.buscarConteudoPorId(requestId);
    if (!conteudo) throw new Error("Não encontrado");
    return conteudo;
  }
}
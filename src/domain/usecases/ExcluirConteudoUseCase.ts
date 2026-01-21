import { IRepository } from "../interfaces/IRepository";

export class ExcluirConteudoUseCase{
  constructor(private repo: IRepository) {}

  async execute(requestId: string) {
    const conteudo = await this.repo.removerConteudo(requestId);
    if (!conteudo) throw new Error("Não encontrado");
    return { requestId };
  }
}
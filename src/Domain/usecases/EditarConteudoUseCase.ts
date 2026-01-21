import { IRepository } from "../interfaces/IRepository";
import { IIAClient } from "../interfaces/IIAClienteService";
import { RegistroConteudo } from "../Models/RequisicaoModelo";
import { ObterConteudoUseCase } from "./ObterConteudoUseCase";

export class EditarConteudoUseCase {
    constructor(
        private repo: IRepository,
    ) { }
    async execute(requestId: string, dados: Required<Pick<RegistroConteudo, 'resultado'>>) {
        // 1. Busca o objeto completo existente
        const atual = await this.repo.buscarConteudoPorId(requestId);

        // 2. Cria um NOVO objeto mesclando o antigo com as atualizações
        const objetoAtualizado = {
            ...atual,  // Espalha: id, disciplinaId, tipoConteudo, numeroSlides...
            ...dados,  // Sobrescreve apenas os campos que vieram na edição
            status: "editado" // Atualiza o status
        };
        // 3. Salva o objeto já mesclado  
        await this.repo.atualizarConteudo(objetoAtualizado);
        return { requestId }
    }
}
import { IConteudoService } from "../interfaces/IConteudoService";
import { IRepository } from "../interfaces/IRepository";
import { SolicitacaoConteudo, RegistroConteudo } from "../Models/RequisicaoModelo";
import { v4 as uuidv4 } from 'uuid';
import { IIAClient } from "../interfaces/IIAClienteService";

export class ConteudoService implements IConteudoService {
  constructor(
    private repo: IRepository,
    private ia: IIAClient
  ) {}

  
  async criarSolicitacao(solicitacao: SolicitacaoConteudo): Promise<{ requestId: string }> {
    const requestId: string = uuidv4();

    await this.repo.salvarConteudoResultado({
      requestId,
      solicitacao,
      status: "pendente",
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });

    /**
     * Envio para a IA:
     */
    const resposta = await this.ia.gerarConteudo(solicitacao);

    await this.repo.atualizarConteudo({
      requestId,
      status: "concluido",
      resultado: resposta,
      atualizadoEm: new Date()
    });

    return { requestId };
  }

  async obterConteudoPorId(requestId: string) {
    const conteudo = await this.repo.buscarConteudoPorId(requestId);
    if (!conteudo) throw new Error("Não encontrado");
    return conteudo;
  }

  async verificarStatusGeracao(requestId: string) {
    const conteudo = await this.obterConteudoPorId(requestId);
    return conteudo.status;
  }

  async editar(requestId: string, dados: Required<Pick<RegistroConteudo, 'resultado'>>) {
    // 1. Busca o objeto completo existente
    const atual = await this.obterConteudoPorId(requestId); 

    // 2. Cria um NOVO objeto mesclando o antigo com as atualizações
    const objetoAtualizado = {
        ...atual,  // Espalha: id, disciplinaId, tipoConteudo, numeroSlides...
        ...dados,  // Sobrescreve apenas os campos que vieram na edição
        status: "pendente" // Atualiza o status
    };

    // 3. Salva o objeto já mesclado
    await this.repo.atualizarConteudo(objetoAtualizado);
    return {requestId}
}

  async excluir(requestId: string) {
    await this.repo.removerConteudo(requestId);
    return {requestId};
  }
}

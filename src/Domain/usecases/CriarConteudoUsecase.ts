import { IRepository } from "../interfaces/IRepository";
import { IIAClient } from "../interfaces/IIAClienteService";
import { IAClientService } from "../services/IAClientService";
import { SolicitacaoConteudo, RegistroConteudo } from "../Models/RequisicaoModelo";

import { v4 as uuid } from "uuid";

// export class CriarConteudoUseCase {
//   constructor(
//     private conteudoRepository: IRepository,
//     private iaGateway: IAClientService
//   ) {}

//   async execute(solicitacao: SolicitacaoConteudo): Promise<string> {
//     const requestId = uuid();

//     const registro: RegistroConteudo = {
//       requestId,
//       solicitacao,
//       status: "pendente",
//       criadoEm: new Date(),
//       atualizadoEm: new Date()
//     };

//     await this.conteudoRepository.salvarConteudoResultado(registro);

//     // dispara async
//     this.iaGateway.gerarConteudo(registro);

//     return requestId;
//   }
// }

export class CriarConteudoUseCase {
    constructor(
        private repo: IRepository,
        private ia: IIAClient
    ) { }

    async execute(solicitacao: SolicitacaoConteudo): Promise<string> {
        const requestId = uuid();

        await this.repo.salvarConteudoResultado({
            requestId,
            solicitacao,
            status: "pendente",
            criadoEm: new Date(),
            atualizadoEm: new Date()
        });

        // forma sincrona (apenas quando a ia responder e caso responder volta resposta)

        // const resposta = await this.ia.gerarConteudo(solicitacao);

        // await this.repo.atualizarConteudo({
        //     requestId,
        //     status: "concluido",
        //     resultado: resposta,
        //     atualizadoEm: new Date()
        // });

        // forma assincrona (dispara erro se der erro, mas não trava o fluxo)

        this.ia.gerarConteudo(solicitacao)
            .then(resposta => {
                this.repo.atualizarConteudo({
                    requestId,
                    status: "concluido",
                    resultado: resposta,
                    atualizadoEm: new Date()
                });
            })
            .catch(err => {
                this.repo.atualizarConteudo({
                    requestId,
                    status: "erro",
                    atualizadoEm: new Date()
                });
            });

        return requestId;

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
        return { requestId }
    }

    async excluir(requestId: string) {
        await this.repo.removerConteudo(requestId);
        return { requestId };
    }
}



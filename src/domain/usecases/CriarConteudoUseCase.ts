import { IRepository } from "../interfaces/IRepository";
import { IIAClient } from "../interfaces/IIAClienteService";
import { IAClientService } from "../services/IAClientService";
import { SolicitacaoConteudo, RegistroConteudo } from "../models/RequisicaoModelo";

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

    async execute(solicitacao: SolicitacaoConteudo): Promise<{ requestId: string }> {
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

        this.ia.gerarConteudoAsync(solicitacao)
            .then(async resposta => {
                await this.repo.atualizarConteudo({
                    requestId,
                    status: "concluido",
                    resultado: resposta,
                    atualizadoEm: new Date()
                });
            })
            .catch(async err => {
                console.error("Erro ao gerar conteúdo pela IA:", err);
                
                await this.repo.atualizarConteudo({
                    requestId,
                    status: "erro",
                    atualizadoEm: new Date()
                });
            });

        return {requestId};

    }
}



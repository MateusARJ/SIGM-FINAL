import { IConteudoService } from "../interfaces/IConteudoService";
import { IRepository } from "../interfaces/IRepository";
import { SolicitacaoConteudo, RegistroConteudo } from "../Models/RequisicaoModelo";

import { ObterConteudoUseCase } from "../usecases/ObterConteudoUseCase";
import { VerificarStatusUseCase } from "../usecases/VerificarStatusUseCase";
import { EditarConteudoUseCase } from "../usecases/EditarConteudoUseCase";
import { ExcluirConteudoUseCase } from "../usecases/ExcluirConteudoUseCase";
import { CriarConteudoUseCase } from "../usecases/CriarConteudoUseCase";

import { v4 as uuidv4 } from 'uuid';
import { IIAClient } from "../interfaces/IIAClienteService";

// export class ConteudoService implements IConteudoService {
//   constructor(
//     private repo: IRepository,
//     private ia: IIAClient
//   ) {}

  
//   async criarSolicitacao(solicitacao: SolicitacaoConteudo): Promise<{ requestId: string }> {
//     const requestId: string = uuidv4();

//     await this.repo.salvarConteudoResultado({
//       requestId,
//       solicitacao,
//       status: "pendente",
//       criadoEm: new Date(),
//       atualizadoEm: new Date()
//     });

//     /**
//      * Envio para a IA:
//      */
//     const resposta = await this.ia.gerarConteudo(solicitacao);

//     await this.repo.atualizarConteudo({
//       requestId,
//       status: "concluido",
//       resultado: resposta,
//       atualizadoEm: new Date()
//     });

//     return { requestId };
//   }

//   async obterConteudoPorId(requestId: string) {
//     const conteudo = await this.repo.buscarConteudoPorId(requestId);
//     if (!conteudo) throw new Error("Não encontrado");
//     return conteudo;
//   }

//   async verificarStatusGeracao(requestId: string) {
//     const conteudo = await this.obterConteudoPorId(requestId);
//     return conteudo.status;
//   }

//   async editar(requestId: string, dados: Required<Pick<RegistroConteudo, 'resultado'>>) {
//     // 1. Busca o objeto completo existente
//     const atual = await this.obterConteudoPorId(requestId); 

//     // 2. Cria um NOVO objeto mesclando o antigo com as atualizações
//     const objetoAtualizado = {
//         ...atual,  // Espalha: id, disciplinaId, tipoConteudo, numeroSlides...
//         ...dados,  // Sobrescreve apenas os campos que vieram na edição
//         status: "pendente" // Atualiza o status
//     };

//     // 3. Salva o objeto já mesclado
//     await this.repo.atualizarConteudo(objetoAtualizado);
//     return {requestId}
// }

//   async excluir(requestId: string) {
//     await this.repo.removerConteudo(requestId);
//     return {requestId};
//   }
// }
// export class ConteudoService implements IConteudoService {
//   constructor(
//     private criarConteudo: CriarConteudoUseCase, // injetado o usecase específico
//     private repo: IRepository
//   ) {}

//   /**
//    * Facade para criar solicitação
//    * 
//    * ela chama o usecase especifico para criação de conteúdo e devolve requestId
//    */
//   criarSolicitacao(s: SolicitacaoConteudo): Promise<{ requestId: string }> {
//     return this.criarConteudo.execute(s);
//   }

//   async obterConteudoPorId(requestId: string) {
//         const conteudo = await this.repo.buscarConteudoPorId(requestId);
//         if (!conteudo) throw new Error("Não encontrado");
//         return conteudo;
//     }

//     async verificarStatusGeracao(requestId: string) {
//         const conteudo = await this.obterConteudoPorId(requestId);
//         return conteudo.status;
//     }

//     async editar(requestId: string, dados: Required<Pick<RegistroConteudo, 'resultado'>>) {
//         // 1. Busca o objeto completo existente
//         const atual = await this.obterConteudoPorId(requestId);

//         // 2. Cria um NOVO objeto mesclando o antigo com as atualizações
//         const objetoAtualizado = {
//             ...atual,  // Espalha: id, disciplinaId, tipoConteudo, numeroSlides...
//             ...dados,  // Sobrescreve apenas os campos que vieram na edição
//             status: "editado" // Atualiza o status
//         };

//         // 3. Salva o objeto já mesclado  
//         await this.repo.atualizarConteudo(objetoAtualizado);
//         return { requestId }
//     }

//     async excluir(requestId: string) {
//         await this.repo.removerConteudo(requestId);
//         return { requestId };
//     }
// }

/**
 * Funções dessa classe são facade ou seja apontam outras funções
 * executoras no caso os UseCases
 */
export class ConteudoService implements IConteudoService {
  constructor(
    private criarConteudo: CriarConteudoUseCase,
    private obterConteudo: ObterConteudoUseCase,
    private verificarStatus: VerificarStatusUseCase,
    private editarConteudo: EditarConteudoUseCase,
    private excluirConteudo: ExcluirConteudoUseCase
  ) {}

  criarSolicitacao(s: SolicitacaoConteudo) {
    return this.criarConteudo.execute(s);
  }

  obterConteudoPorId(id: string) {
    return this.obterConteudo.execute(id);
  }

  verificarStatusGeracao(id: string) {
    return this.verificarStatus.execute(id);
  }

  editar(id: string, dados: Required<Pick<RegistroConteudo, 'resultado'>>) {
    return this.editarConteudo.execute(id, dados);
  }

  excluir(id: string) {
    return this.excluirConteudo.execute(id);
  }
}

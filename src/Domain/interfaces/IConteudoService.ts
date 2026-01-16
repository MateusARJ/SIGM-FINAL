import { SolicitacaoConteudo } from "../Models/RequisicaoModelo";

export interface IConteudoService {
  salvarGeracao(solicitacao: SolicitacaoConteudo): Promise<string>;
  verificarStatusGeracao(requestId: string): Promise<string>;
  obterConteudoGerado(requestId: string): Promise<any>; // nota: alterar esse promisse
}
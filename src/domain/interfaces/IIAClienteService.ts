import { SolicitacaoConteudo } from "../models/RequisicaoModelo";


export interface IIAClient {
  gerarConteudoAsync(solicitacao: SolicitacaoConteudo): Promise<{
    tipo: string;
    conteudo: string;
  }>;
}
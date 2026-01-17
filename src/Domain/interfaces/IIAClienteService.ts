import { SolicitacaoConteudo } from "../Models/RequisicaoModelo";


export interface IIAClient {
  gerarConteudo(solicitacao: SolicitacaoConteudo): Promise<{
    tipo: string;
    conteudo: string;
  }>;
}
import { SolicitacaoConteudo, RegistroConteudo } from "../models/RequisicaoModelo";

export interface IConteudoService {
  criarSolicitacao(solicitacao: SolicitacaoConteudo): Promise<{ requestId: string }>;
  obterConteudoPorId(requestId: string): Promise<RegistroConteudo>;
  editar(requestId: string, dados: Required<Pick<RegistroConteudo, 'resultado'>>): Promise<{ requestId: string }>;
  excluir(requestId: string): Promise<{ requestId: string }>
  verificarStatusGeracao(requestId: string): Promise<string>;
}
import { SolicitacaoConteudo, RegistroConteudo } from "../Models/RequisicaoModelo";

export interface IConteudoService {
  criarSolicitacao(data: Omit<SolicitacaoConteudo, 'id'>): Promise<{ requestId: string }>;
  obterConteudoPorId(requestId: string): Promise<RegistroConteudo>;
  editar(requestId: string, dados: Partial<Omit<SolicitacaoConteudo, 'id'>>): Promise<{ requestId: string }>;
  excluir(requestId: string): Promise<{ requestId: string }>
  verificarStatusGeracao(requestId: string): Promise<string>;

}
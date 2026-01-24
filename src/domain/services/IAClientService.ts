import { IIAClient } from "../interfaces/IIAClienteService";
import { SolicitacaoConteudo } from "../models/RequisicaoModelo";
import { GeminiService } from "../../infra/ai/infra/aiServices/geminiService";
import { GerarConteudoUseCase } from "../../infra/ai/core/useCases/gerarConteudoUseCase";
import { converterSolicitacaoParaGerarMaterialDTO } from "../../infra/ai/core/dtoAi/conversor";
import { IRepository } from "../interfaces/IRepository";
import { IBnccRetriever } from "../../infra/ai/infra/retrieval/core/interfaces/IBnccRetriever";

/**
 * Type para a solicitação enriquecida com nomes de disciplina e assunto
 */
type SolicitacaoEnriquecida = SolicitacaoConteudo & {
  nomeDisciplina?: string;
  assuntoTitulo?: string;
};

/**
 * IAClientService: Adaptador entre a camada de Services e a camada AI
 * 
 * Responsabilidades:
 * 1. Receber SolicitacaoConteudo (formato dos Services)
 * 2. Enriquecer com nomes de disciplina/assunto da repository
 * 3. Converter para GerarMaterialDTO (formato da IA)
 * 4. Chamar GeminiService para gerar conteúdo
 * 5. Retornar resultado ao ConteudoService
 */
export class IAClientService implements IIAClient {
  private gerarConteudoUseCase: GerarConteudoUseCase;
  private repository: IRepository;

  // 🆕 Retriever injetado no boot
  private bnccRetriever: IBnccRetriever;

  constructor(repository: IRepository, bnccRetriever: IBnccRetriever) {
    /**
     * 🔹 1. Instancia os serviços da camada AI
     * (Gemini agora recebe o retriever pronto com a base vetorial carregada)
     */
    const geminiService = new GeminiService(bnccRetriever);
    this.gerarConteudoUseCase = new GerarConteudoUseCase(geminiService);

    /**
     * 🔹 2. Infra de domínio
     */
    this.repository = repository;
    this.bnccRetriever = bnccRetriever;
  }

  async gerarConteudoAsync(
    solicitacao: SolicitacaoConteudo
  ): Promise<{ tipo: string; conteudo: string }> {
    
    try {
      // 0️⃣ ENRIQUECER: Buscar nomes de disciplina e assunto pelos IDs
      const solicitacaoEnriquecida: SolicitacaoEnriquecida = { ...solicitacao };
      
      try {
        const disciplina = await this.repository.getDisciplinaById(solicitacao.disciplinaId);
        if (disciplina) {
          solicitacaoEnriquecida.nomeDisciplina = disciplina.nome;
          console.log(`✅ Disciplina encontrada: ${disciplina.nome}`);
        }
      } catch (e) {
        console.warn(`⚠️ Não conseguiu buscar disciplina com ID: ${solicitacao.disciplinaId}`);
      }

      try {
        const assunto = await this.repository.getAssuntoById(solicitacao.assuntoId);
        if (assunto) {
          solicitacaoEnriquecida.assuntoTitulo = assunto.nome;
          console.log(`✅ Assunto encontrado: ${assunto.nome}`);
        }
      } catch (e) {
        console.warn(`⚠️ Não conseguiu buscar assunto com ID: ${solicitacao.assuntoId}`);
      }

      // 1️⃣ CONVERTE: SolicitacaoConteudo → GerarMaterialDTO
      const materialDTO = converterSolicitacaoParaGerarMaterialDTO(
        solicitacaoEnriquecida as SolicitacaoConteudo
      );

      // 2️⃣ CHAMA A IA baseado no tipo de conteúdo
      let resposta;
      switch (solicitacao.tipoConteudo) {
        case "aula":
          resposta = await this.gerarConteudoUseCase.gerarPlano(materialDTO);
          break;
        case "prova":
          resposta = await this.gerarConteudoUseCase.gerarProva(materialDTO);
          break;
        case "tarefa":
          resposta = await this.gerarConteudoUseCase.gerarAtividade(materialDTO);
          break;
        default:
          throw new Error('Tipo de conteúdo não identificável');
      }

      // 3️⃣ RETORNA o resultado da IA
      return {
        tipo: resposta.tipo,
        conteudo: resposta.conteudo
      };
    } catch (error) {
      console.error('Erro ao gerar conteúdo na IA:', error);
      throw error;
    }
  }
}

import { IIAClient } from "../interfaces/IIAClienteService";
import { SolicitacaoConteudo } from "../models/RequisicaoModelo";
import { GeminiService } from "../../infra/ai/infra/aiServices/geminiService";
import { GerarConteudoUseCase } from "../../infra/ai/core/useCases/gerarConteudoUseCase";
import { converterSolicitacaoParaGerarMaterialDTO } from "../../infra/ai/core/dtoAi/conversor";
import { IRepository } from "../interfaces/IRepository";

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

  constructor(repository: IRepository) {
    // Instancia os serviços da camada AI
    const geminiService = new GeminiService();
    this.gerarConteudoUseCase = new GerarConteudoUseCase(geminiService);
    this.repository = repository;
  }

  async gerarConteudoAsync(
    solicitacao: SolicitacaoConteudo
  ): Promise<{ tipo: string; conteudo: string }> {

    try {
      // ============================
      // 0️⃣ ENRIQUECER SOLICITAÇÃO
      // ============================

      /**
       * A solicitação original contém apenas IDs.
       * Aqui enriquecemos com dados SEMÂNTICOS reais
       * que a IA consegue entender.
       */
      const solicitacaoEnriquecida: SolicitacaoEnriquecida = { ...solicitacao };

      // ---------- DISCIPLINA ----------
      try {
        const disciplina = await this.repository.getDisciplinaById(
          solicitacao.disciplinaId
        );

        if (disciplina) {
          solicitacaoEnriquecida.nomeDisciplina = disciplina.nome;
          console.log(`✅ Disciplina encontrada: ${disciplina.nome}`);
        }
      } catch {
        console.warn(
          `⚠️ Não foi possível buscar disciplina com ID: ${solicitacao.disciplinaId}`
        );
      }

      // ---------- ASSUNTO ----------
      try {
        const assunto = await this.repository.getAssuntoById(
          solicitacao.assuntoId
        );

        if (assunto) {
          solicitacaoEnriquecida.assuntoTitulo = assunto.nome;
          console.log(`✅ Assunto encontrado: ${assunto.nome}`);
        }
      } catch {
        console.warn(
          `⚠️ Não foi possível buscar assunto com ID: ${solicitacao.assuntoId}`
        );
      }

      /**
       * IMPORTANTE:
       * anoLetivo NÃO é ID.
       * Ele já chega como string humana ("9º ano", "1ª série")
       * e NÃO precisa de enriquecimento.
       */

      // ============================
      // 1️⃣ CONVERSÃO PARA DTO DA IA
      // ============================

      const materialDTO =
        converterSolicitacaoParaGerarMaterialDTO(solicitacaoEnriquecida);

      // ============================
      // 2️⃣ CHAMADA DA IA
      // ============================

      let resposta;

      switch (solicitacao.tipoConteudo) {
        case "aula":
          resposta = await this.gerarConteudoUseCase.gerarPlanoAula(materialDTO);
          break;

        case "prova":
          resposta = await this.gerarConteudoUseCase.gerarProva(materialDTO);
          break;

        case "tarefa":
          resposta = await this.gerarConteudoUseCase.gerarAtividade(materialDTO);
          break;

        default:
          throw new Error("Tipo de conteúdo não suportado");
      }

      // ============================
      // 3️⃣ RETORNO
      // ============================

      return {
        tipo: resposta.tipo,
        conteudo: resposta.conteudo
      };

    } catch (error) {
      console.error("❌ Erro ao gerar conteúdo na IA:", error);
      throw error;
    }
  }
}

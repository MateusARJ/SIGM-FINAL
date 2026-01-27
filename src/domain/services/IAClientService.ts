import { IIAClient } from "../interfaces/IIAClienteService";
import { SolicitacaoConteudo } from "../models/RequisicaoModelo";
import { GeminiService } from "../../infra/ai/infra/aiServices/geminiService";
import { GerarConteudoUseCase } from "../../infra/ai/core/useCases/gerarConteudoUseCase";
import { converterSolicitacaoParaGerarMaterialDTO } from "../../infra/ai/core/dtoAi/conversor";
import { IRepository } from "../interfaces/IRepository";
import { SolicitacaoConteudoResolvida } from "../models/SolicitacaoConteudoResolvida";

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
      // ---------- RESOLVER ANO LETIVO ----------
      const anoLetivo = await this.repository.getAnoLetivoById(solicitacao.serieId);
      if (!anoLetivo) throw new Error("Ano Letivo não encontrado");

      // ---------- RESOLVER DISCIPLINA ----------
      const disciplina = await this.repository.getDisciplinaById(solicitacao.disciplinaId);
      if (!disciplina) throw new Error("Disciplina não encontrada");

      // ---------- RESOLVER ASSUNTO ----------
      const assunto = await this.repository.getAssuntoById(solicitacao.assuntoId);
      if (!assunto) throw new Error("Assunto não encontrado");


      // ---------- CRIAR MODELO INTERMEDIÁRIO SEMÂNTICO ----------
      const solicitacaoResolvida: SolicitacaoConteudoResolvida = {
        ...solicitacao,
        anoLetivo: anoLetivo.nome,
        nomeDisciplina: disciplina.nome,
        assuntoTitulo: assunto.nome
      };

      // ============================
      // 1️⃣ CONVERSÃO PARA DTO DA IA
      // ============================

      const materialDTO =
        converterSolicitacaoParaGerarMaterialDTO(solicitacaoResolvida);

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
    }

    catch (error) {
      console.error("❌ Erro ao gerar conteúdo na IA:", error);
      throw error;
    }
  }
}

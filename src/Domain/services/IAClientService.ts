import { IIAClient } from "../interfaces/IIAClienteService";
import { SolicitacaoConteudo } from "../Models/RequisicaoModelo";
import { GeminiService } from "../ai/infra/aiServices/geminiService";
import { GerarConteudoUseCase } from "../ai/core/useCases/gerarConteudoUseCase";
import { converterSolicitacaoParaGerarMaterialDTO } from "../ai/core/dtoAi/conversor";

/**
 * IAClientService: Adaptador entre a camada de Services e a camada AI
 * 
 * Responsabilidades:
 * 1. Receber SolicitacaoConteudo (formato dos Services)
 * 2. Converter para GerarMaterialDTO (formato da IA)
 * 3. Chamar GeminiService para gerar conteúdo
 * 4. Retornar resultado ao ConteudoService
 */
export class IAClientService implements IIAClient {
  private gerarConteudoUseCase: GerarConteudoUseCase;

  constructor() {
    // Instancia os serviços da camada AI
    const geminiService = new GeminiService();
    this.gerarConteudoUseCase = new GerarConteudoUseCase(geminiService);
  }

  async gerarConteudo(
    solicitacao: SolicitacaoConteudo
  ): Promise<{ tipo: string; conteudo: string }> {
    
    try {
      // 1️⃣ CONVERTE: SolicitacaoConteudo → GerarMaterialDTO
      const materialDTO = converterSolicitacaoParaGerarMaterialDTO(solicitacao);

      // 2️⃣ CHAMA A IA baseado no tipo de conteúdo
      let resposta;
      if ('numeroSlides' in solicitacao) {
        // É uma solicitação de aula
        resposta = await this.gerarConteudoUseCase.gerarPlano(materialDTO);
      } else if ('numeroQuestoes' in solicitacao) {
        // É uma solicitação de prova
        resposta = await this.gerarConteudoUseCase.gerarProva(materialDTO);
      } else if ('numeroExercicios' in solicitacao) {
        // É uma solicitação de tarefa
        resposta = await this.gerarConteudoUseCase.gerarAtividade(materialDTO);
      } else {
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
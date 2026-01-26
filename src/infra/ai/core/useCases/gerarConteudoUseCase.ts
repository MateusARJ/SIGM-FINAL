import { IAService } from '../dtoAi/iAiService'
import { GerarMaterialDTO } from '../dtoAi/entradaDto'
import { RespostaGeracaoDTO } from '../dtoAi/saidaDto'

export class GerarConteudoUseCase {
  constructor(private iaService: IAService) {}

  async gerarPlanoAula(dados: GerarMaterialDTO): Promise<RespostaGeracaoDTO> {
    const conteudo = await this.iaService.gerarPlanoAula(dados)

    return {
      tipo: 'planoAula',
      conteudo
    }
  }

  async gerarAtividade(dados: GerarMaterialDTO): Promise<RespostaGeracaoDTO> {
    const conteudo = await this.iaService.gerarAtividade(dados)

    return {
      tipo: 'atividade',
      conteudo
    }
  }

  async gerarProva(dados: GerarMaterialDTO): Promise<RespostaGeracaoDTO> {
    const conteudo = await this.iaService.gerarProva(dados)

    return {
      tipo: 'prova',
      conteudo
    }
  }
}
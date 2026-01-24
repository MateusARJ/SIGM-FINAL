import { GerarMaterialDTO } from "../../../../core/dtoAi/entradaDto";

/**
 * Contrato para qualquer mecanismo de recuperação
 * de conhecimento (RAG).
 *
 * Hoje: mock
 * Amanhã: Chroma, PDF, etc.
 */
export interface IBnccRetriever {
  recuperarContexto(dados: GerarMaterialDTO): Promise<string>;
}

import { IBnccRetriever } from "./interfaces/IBnccRetriever";
import { GerarMaterialDTO } from "../../core/dtoAi/entradaDto";
import bncc from "../../data/bncc/bncc.json";

/**
 * Implementação MOCK do RAG.
 * 
 * Simula a recuperação de contexto da BNCC
 * sem banco vetorial.
 */
export class BnccRetriever implements IBnccRetriever {

  async recuperarContexto(dados: GerarMaterialDTO): Promise<string> {
    const competencias = bncc.competencias_gerais.join("\n");

    const regrasNivel = bncc.regras_por_nivel[dados.nivel as keyof typeof bncc.regras_por_nivel]?.join("\n") || "";

    return `
CONTEXTO PEDAGÓGICO (BNCC - MOCK):

Competências Gerais:
${competencias}

Diretrizes para o nível ${dados.nivel}:
${regrasNivel}
`;
  }
}

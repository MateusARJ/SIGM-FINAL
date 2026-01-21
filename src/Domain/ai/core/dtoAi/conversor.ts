import { SolicitacaoConteudo } from "../../../Models/RequisicaoModelo";
import { GerarMaterialDTO } from "./entradaDto";

/**
 * Converte SolicitacaoConteudo (formato dos Services)
 * para GerarMaterialDTO (formato da Camada AI)
 */
export function converterSolicitacaoParaGerarMaterialDTO(
  solicitacao: SolicitacaoConteudo
): GerarMaterialDTO {
  // Determina o nível baseado no ano letivo
  // Fundamental: 1º ao 9º ano
  // Médio: 1ª, 2ª, 3ª série (ou 1º, 2º, 3º ano do médio)
  
  const anoLetivo = solicitacao.anoLetivo.toLowerCase();
  
  // Verifica se é fundamental (1º ao 9º ano)
  const isFundamental = /[1-9]º\s*ano/.test(anoLetivo) || 
                       anoLetivo.includes('fundamental');
  
  // Verifica se é médio (1ª, 2ª, 3ª série ou 1º, 2º, 3º ano médio)
  const isMedia = /[1-3]ª\s*série/.test(anoLetivo) || 
                 /[1-3]º\s*ano\s*(médio|medio)/.test(anoLetivo) ||
                 anoLetivo.includes('ensino médio') ||
                 anoLetivo.includes('ensino medio');
  
  const nivelEnsino: 'fundamental' | 'medio' = isMedia ? 'medio' : 'fundamental';

  return {
    disciplina: solicitacao.disciplinaId,
    ano: solicitacao.anoLetivo,
    tema: solicitacao.assuntoId,
    nivel: nivelEnsino
  };
}

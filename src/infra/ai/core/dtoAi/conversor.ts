import { SolicitacaoConteudo } from "../../../../domain/models/RequisicaoModelo";
import { GerarMaterialDTO } from "./entradaDto";

/**
 * Converte SolicitacaoConteudo (formato dos Services)
 * para GerarMaterialDTO (formato da Camada AI)
 */
export function converterSolicitacaoParaGerarMaterialDTO(
  solicitacao: SolicitacaoConteudo
): GerarMaterialDTO {
  // DEBUG: Verifica se solicitacao está vindo corretamente
  if (!solicitacao) {
    console.error("❌ ERRO: solicitacao é undefined");
    throw new Error("Solicitação de conteúdo é undefined");
  }
  
  if (!solicitacao.anoLetivo) {
    console.error("❌ ERRO: anoLetivo é undefined. Objeto recebido:", solicitacao);
    throw new Error("anoLetivo é obrigatório");
  }

  // ⚠️ nomeDisciplina e assuntoTitulo devem ter sido enriquecidos pelo IAClientService
  // Se não foram encontrados, usa os IDs como fallback
  const nomeDisciplina = (solicitacao as any).nomeDisciplina || solicitacao.disciplinaId;
  const assuntoTitulo = (solicitacao as any).assuntoTitulo || solicitacao.assuntoId;

  if (!nomeDisciplina || !assuntoTitulo) {
    const campos = [];
    if (!nomeDisciplina) campos.push("disciplina");
    if (!assuntoTitulo) campos.push("assunto");
    
    console.error(`❌ ERRO: Não conseguiu encontrar ${campos.join(" e ")}`);
    throw new Error(`Erro ao buscar dados de ${campos.join(" e ")}`);
  }
  if (!assuntoTitulo) {
    console.error("❌ ERRO: assuntoTitulo não foi fornecido");
    throw new Error("assuntoTitulo é obrigatório na requisição");
  }
  
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

  const dto: GerarMaterialDTO = {
    // Usa o nome da disciplina (obrigatório)
    disciplina: nomeDisciplina,
    ano: solicitacao.anoLetivo,
    // Usa o título do assunto (obrigatório)
    tema: assuntoTitulo,
    nivel: nivelEnsino,
    
    // Passa as configurações opcionais
    instrucoesExtras: (solicitacao as any).instrucoesExtras,
    numeroSlides: (solicitacao as any).numeroSlides,
    incluirImagens: (solicitacao as any).incluirImagens,
    incluirAtividades: (solicitacao as any).incluirAtividades,
    estilo: (solicitacao as any).estilo
  };

  return dto;
}

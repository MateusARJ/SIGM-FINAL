import { SolicitacaoConteudo } from "../../../../domain/models/RequisicaoModelo";
import { GerarMaterialDTO } from "./entradaDto";
import { SolicitacaoConteudoEnriquecida } from "../../../../domain/models/RequisicaoModelo";

/**
 * Converte SolicitacaoConteudo (formato dos Services)
 * para GerarMaterialDTO (formato da Camada AI)
 *
 * Regras importantes:
 * - A IA NUNCA deve receber IDs (UUIDs)
 * - Disciplina, tema e ano devem ser strings reais
 * - Se algo essencial não existir → ERRO (fail fast)
 */
export function converterSolicitacaoParaGerarMaterialDTO(
  solicitacao: SolicitacaoConteudoEnriquecida
): GerarMaterialDTO {

  // ============================
  // 1️⃣ Validações iniciais
  // ============================

  if (!solicitacao) {
    console.error("❌ ERRO: solicitacao é undefined");
    throw new Error("Solicitação de conteúdo é obrigatória");
  }

  if (!solicitacao.anoLetivo) {
    console.error("❌ ERRO: anoLetivo não informado", solicitacao);
    throw new Error("anoLetivo é obrigatório");
  }

  /**
   * IMPORTANTE:
   * nomeDisciplina e assuntoTitulo DEVEM ter sido
   * enriquecidos previamente pelo IAClientService.
   *
   * Se não existirem aqui, a IA NÃO pode ser chamada.
   */
  const nomeDisciplina = solicitacao.nomeDisciplina;
  const assuntoTitulo = solicitacao.assuntoTitulo;


  if (!nomeDisciplina || typeof nomeDisciplina !== "string") {
    throw new Error(
      "Disciplina não encontrada. Não é permitido enviar ID para a IA."
    );
  }

  if (!assuntoTitulo || typeof assuntoTitulo !== "string") {
    throw new Error(
      "Assunto não encontrado. Não é permitido enviar ID para a IA."
    );
  }

  // ============================
  // 2️⃣ Determinar nível de ensino
  // ============================

  /**
   * Regra correta:
   * - 1ª, 2ª, 3ª SÉRIE → ENSINO MÉDIO
   * - 1º ao 9º ANO → FUNDAMENTAL
   */
  const anoLetivoNormalizado = solicitacao.anoLetivo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const isEnsinoMedio =
    // Qualquer variação de "SÉRIE" → ENSINO MÉDIO
    /\b[1-3]\s*(ª|a|º|o)?\s*serie\b/.test(anoLetivoNormalizado) ||

    // Menção direta a ensino médio
    anoLetivoNormalizado.includes("ensino medio") ||

    // Casos como: "1 ano do ensino medio"
    /\b[1-3]\s*(º|o)?\s*ano\s*(do\s*)?(ensino\s*)?medio\b/.test(
      anoLetivoNormalizado
    );

  const nivelEnsino: "fundamental" | "medio" =
    isEnsinoMedio ? "medio" : "fundamental";

  // ============================
  // 3️⃣ Criação do DTO base
  // ============================

  const dto: GerarMaterialDTO = {
    // Dados SEMÂNTICOS reais (nunca IDs)
    disciplina: nomeDisciplina,
    tema: assuntoTitulo,
    ano: solicitacao.anoLetivo,
    nivel: nivelEnsino
  };

  // ============================
  // 4️⃣ Configurações opcionais
  // (baseadas no tipo de conteúdo)
  // ============================

  /**
   * AQUI usamos o discriminador `tipoConteudo`
   * para que o TypeScript saiba exatamente
   * qual configuração está disponível.
   */

  // ---------- AULA ----------
  if (solicitacao.tipoConteudo === "aula") {
    if (solicitacao.numeroSlides !== undefined) {
      dto.numeroSlides = solicitacao.numeroSlides;
    }

    if (solicitacao.incluirImagens !== undefined) {
      dto.incluirImagens = solicitacao.incluirImagens;
    }

    if (solicitacao.incluirAtividades !== undefined) {
      dto.incluirAtividades = solicitacao.incluirAtividades;
    }

    if (solicitacao.estilo !== undefined) {
      dto.estilo = solicitacao.estilo;
    }
    
  }

  // ---------- PROVA ----------
  if (solicitacao.tipoConteudo === "prova") {
    dto.numeroQuestoes = solicitacao.numeroQuestoes;
    dto.tiposQuestao = solicitacao.tiposQuestao;
    dto.nivelDificuldade = solicitacao.nivelDificuldade;
    dto.incluirGabarito = solicitacao.incluirGabarito;
  }

// ---------- TAREFA ----------
  if (solicitacao.tipoConteudo === "tarefa") {
    dto.numeroExercicios = solicitacao.numeroExercicios;

    if (solicitacao.incluirExemplos !== undefined) {
      dto.incluirExemplos = solicitacao.incluirExemplos;
    }

    if (solicitacao.prazoEntrega !== undefined) {
      dto.prazoEntrega = solicitacao.prazoEntrega;
    }
  }

  
  return dto;
}

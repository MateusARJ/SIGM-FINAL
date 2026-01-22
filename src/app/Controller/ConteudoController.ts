import { Router } from "express";
import { IConteudoService } from "../../domain/interfaces/IConteudoService";

export function conteudoRoutes(conteudoService: IConteudoService) {
  const router = Router();

  /**
   * Inicia a geração de conteúdo
   * POST /conteudos
   */
  router.post("/", async (req, res) => {
    try {
      const requestId = await conteudoService.criarSolicitacao(req.body);
      res.status(202).json({ requestId });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  /**
   * Verifica o status da geração
   * GET /conteudos/:requestId/status
   */
  router.get("/:requestId/status", async (req, res) => {
    try {
      const status = await conteudoService.verificarStatusGeracao(
        req.params.requestId
      );
      res.json({ status });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  /**
   * Obtém o conteúdo gerado   * GET /conteudos/:requestId
   */
  router.get("/:requestId", async (req, res) => {
    try {
      const conteudo = await conteudoService.obterConteudoPorId(
        req.params.requestId
      );
      res.json(conteudo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  /**
   * Obtém o conteúdo gerado (alias para /result)   * GET /conteudos/:requestId
   */
  router.get("/:requestId/result", async (req, res) => {
    try {
      const conteudo = await conteudoService.obterConteudoPorId(
        req.params.requestId
      );
      res.json(conteudo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  /**
   * Edita a solicitação de geração de conteúdo
   * PUT /conteudos/:requestId
   */
  router.put("/:requestId", async (req, res) => {
    try {
      const requestId = await conteudoService.editar(
        req.params.requestId,
        req.body
      );
      res.json({ requestId });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.delete("/:requestId", async (req, res) => {
    try {
      const requestId = await conteudoService.excluir(req.params.requestId);
      res.json({ requestId });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro inesperado" });
      }
    }
  })


  return router;
}

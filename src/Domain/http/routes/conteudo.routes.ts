import { Router } from "express";
import { IConteudoService } from "../../interfaces/IConteudoService";

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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  /**
   * Obtém o conteúdo gerado
   * GET /conteudos/:requestId
   */
  router.get("/:requestId", async (req, res) => {
    try {
      const conteudo = await conteudoService.obterConteudoPorId(
        req.params.requestId
      );
      res.json(conteudo);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete("/:requestId", async (req, res) => {
    try {
      const requestId = await conteudoService.excluir(req.params.requestId);
      res.json({ requestId });
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
      
  })


  return router;
}

import { Router } from 'express';
import { IAssuntoService } from '../../interfaces/IAssuntoService';

export function assuntoRoutes(service: IAssuntoService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const assuntos = await service.list();
    res.json(assuntos);
  });

    // PRIMEIRO as rotas /search
  router.get('/search/:name', async (req, res) => {

    try {
      const assunto = await service.findByName(req.params.name);
      if (assunto) {
        res.json(assunto);
      }
    }
    catch (err: any) {
      res.status(404).json({ error: 'Assunto not found' });
    }
  });

  /**
   * findAssuntoByDisciplina
   * Busca todos os assuntos associados a uma disciplina específica.
   * 
   * @param disciplinaId - O ID da disciplina cujos assuntos serão buscados.
   * @returns Uma Promise que resolve para um array de objetos Assunto.
   */
  router.get('/search/disciplina/:disciplinaId', async (req, res) => {
    try {
      const assuntos = await service.findAssuntoByDisciplina(req.params.disciplinaId);
      if (assuntos.length > 0) {
        res.json(assuntos);
      } else {
        res.status(404).json({ error: 'Nenhum assunto encontrado para esta disciplina' });
      }
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const assunto = await service.get(req.params.id);
      res.json(assunto);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const criado = await service.create(req.body);
      res.status(201).json(criado);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      await service.update(req.params.id, req.body);
      res.sendStatus(204);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await service.delete(req.params.id);
      res.sendStatus(204);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  return router;
}

import { Router } from 'express';
import { IAssuntoService } from '../../interfaces/IAssuntoService';

export function assuntoRoutes(service: IAssuntoService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const assuntos = await service.list();
    res.json(assuntos);
  });

  router.get('/:id', async (req, res) => {
    try {
      const assunto = await service.get(req.params.id);
      res.json(assunto);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

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

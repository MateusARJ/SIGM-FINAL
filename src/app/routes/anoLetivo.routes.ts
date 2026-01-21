import { Router } from 'express';
import { IAnoLetivoService } from '../../domain/interfaces/IAnoLetivoService';

export function anoLetivoRoutes(service: IAnoLetivoService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const anosLetivos = await service.list();
    res.json(anosLetivos);
  });

  router.get('/:id', async (req, res) => {
    try {
      const anoLetivo = await service.get(req.params.id);
      res.json(anoLetivo);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  router.get('/search/:name', async (req, res) => {
    try {
        const anoLetivo = await service.findByName(req.params.name);
      res.json(anoLetivo);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

//   router.post('/', async (req, res) => {
//   console.log("HEADERS:", req.headers);
//   console.log("BODY:", req.body);

//   try {
//     const criado = await service.create(req.body);
//     res.status(201).json(criado);
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });


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
      const editado =await service.update(req.params.id, req.body);
      res.json(editado);
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

import { Router } from 'express';
import {
  getAutores,
  getAutorById,
  postAutor,
  putAutor,
  deleteAutor,
} from '../controllers/autor.controller';

const router = Router();

// Ensure that getAutorById is a valid Express handler (req, res, next?) => void or Promise<void>
router.get('/', getAutores);
router.get('/:id', getAutorById as any);
router.post('/', postAutor);
router.put('/:id', putAutor);
router.delete('/:id', deleteAutor);

export default router;
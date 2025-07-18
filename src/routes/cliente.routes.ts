import { Router } from 'express';
import {
  getClientes,
  postCliente,
  deleteCliente,
  putCliente,
  getClienteById
} from '../controllers/cliente.controller';

const router = Router();

router.get('/', getClientes);
router.post('/', postCliente);
router.delete('/:id', deleteCliente);
router.put('/:id', putCliente);
router.get('/:id', getClienteById);

export default router;

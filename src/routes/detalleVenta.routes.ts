// src/Routes/detalleVenta.routes.ts
import { Router } from 'express';
import {
  postDetalleVenta,
  getDetallesPorVenta,
} from '../controllers/detalleVenta.controller';

const router = Router();

router.post('/', postDetalleVenta);
router.get('/:venta_id', getDetallesPorVenta);

export default router;

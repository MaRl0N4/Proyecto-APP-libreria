import { Router, RequestHandler } from 'express';
import { getVentas, getVentaById, postVenta, getVentasTotales } from '../controllers/venta.controller';

const router = Router();
router.get("/totales", getVentasTotales);
router.get('/', getVentas as RequestHandler);
router.get('/:id', getVentaById as RequestHandler);
router.post('/', postVenta as RequestHandler);

export default router;

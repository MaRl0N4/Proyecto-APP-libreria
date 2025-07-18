import { Router } from 'express';
import {
  getLibros,
  getLibroById,
  postLibro,
  putLibro,
  deleteLibro,
  getLibrosBestSellerAutores,
  getLibrosMasVendidosDetalle,
  getLibrosBajaRotacionConVentas,
} from '../controllers/libro.controller';

const router = Router();

router.get("/baja-rotacion", getLibrosBajaRotacionConVentas);
router.get('/mas-vendidos-detalle', getLibrosMasVendidosDetalle);
router.get('/best-seller-autores', getLibrosBestSellerAutores); // 🔼 primero
router.get('/', getLibros);
router.get('/:id', getLibroById); // 🔽 después
router.post('/', postLibro);
router.put('/:id', putLibro);
router.delete('/:id', deleteLibro);

export default router;

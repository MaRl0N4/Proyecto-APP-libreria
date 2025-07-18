"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const libro_controller_1 = require("../controllers/libro.controller");
const router = (0, express_1.Router)();
router.get("/baja-rotacion", libro_controller_1.getLibrosBajaRotacionConVentas);
router.get('/mas-vendidos-detalle', libro_controller_1.getLibrosMasVendidosDetalle);
router.get('/best-seller-autores', libro_controller_1.getLibrosBestSellerAutores); // 🔼 primero
router.get('/', libro_controller_1.getLibros);
router.get('/:id', libro_controller_1.getLibroById); // 🔽 después
router.post('/', libro_controller_1.postLibro);
router.put('/:id', libro_controller_1.putLibro);
router.delete('/:id', libro_controller_1.deleteLibro);
exports.default = router;

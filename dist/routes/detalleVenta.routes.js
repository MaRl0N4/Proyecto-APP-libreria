"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/Routes/detalleVenta.routes.ts
const express_1 = require("express");
const detalleVenta_controller_1 = require("../controllers/detalleVenta.controller");
const router = (0, express_1.Router)();
router.post('/', detalleVenta_controller_1.postDetalleVenta);
router.get('/:venta_id', detalleVenta_controller_1.getDetallesPorVenta);
exports.default = router;

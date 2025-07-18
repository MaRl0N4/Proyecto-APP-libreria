"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetallesPorVenta = exports.postDetalleVenta = void 0;
const detalleVenta_model_1 = require("../models/detalleVenta.model");
const postDetalleVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detalle = yield (0, detalleVenta_model_1.crearDetalleVenta)(req.body);
        res.status(201).json(detalle);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear detalle de venta' });
    }
});
exports.postDetalleVenta = postDetalleVenta;
const getDetallesPorVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ventaId = Number(req.params.venta_id);
    const detalles = yield (0, detalleVenta_model_1.obtenerDetallePorVenta)(ventaId);
    res.json(detalles);
});
exports.getDetallesPorVenta = getDetallesPorVenta;

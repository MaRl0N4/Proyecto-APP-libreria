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
exports.getVentasTotales = exports.postVenta = exports.getVentaById = exports.getVentas = void 0;
const Venta_model_1 = require("../models/Venta.model");
const detalleVenta_model_1 = require("../models/detalleVenta.model");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getVentas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ventas = yield (0, Venta_model_1.obtenerVentas)();
        res.json(ventas);
    }
    catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getVentas = getVentas;
const getVentaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const venta = yield (0, Venta_model_1.obtenerVentaPorId)(id);
        if (!venta)
            return res.status(404).json({ error: 'Venta no encontrada' });
        const detalles = yield (0, detalleVenta_model_1.obtenerDetallePorVenta)(id);
        res.json(Object.assign(Object.assign({}, venta), { detalles }));
    }
    catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getVentaById = getVentaById;
const postVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente, fecha, total, forma_pago, detalles } = req.body;
    // Validación básica
    if (!id_cliente ||
        !fecha ||
        !total ||
        !forma_pago ||
        !Array.isArray(detalles) ||
        detalles.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos o mal formateados' });
    }
    // Limpieza de detalles recibidos
    const detallesLimpios = detalles.map(({ libroIsbn, cantidad, precio_unitario, subtotal }) => ({
        libroIsbn: Number(libroIsbn),
        cantidad: Number(cantidad),
        precio_unitario: Number(precio_unitario),
        subtotal: Number(subtotal)
    }));
    try {
        const venta = yield (0, Venta_model_1.crearVentaConDetalles)({
            id_cliente: Number(id_cliente),
            fecha: new Date(fecha),
            total: Number(total),
            forma_pago
        }, detallesLimpios);
        res.status(201).json({ message: 'Venta registrada correctamente', venta });
    }
    catch (error) {
        console.error('Error al registrar venta:', error.message || error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
});
exports.postVenta = postVenta;
const getVentasTotales = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ventas = yield prisma.ventasTotales.findMany();
        res.json(ventas);
    }
    catch (error) {
        console.error("Error al obtener ventas totales:", error);
        res.status(500).json({ error: "No se pudo recuperar la vista ventas_totales" });
    }
});
exports.getVentasTotales = getVentasTotales;

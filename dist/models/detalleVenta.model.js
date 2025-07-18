"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerDetallePorVenta = exports.crearDetalleVenta = void 0;
// src/Models/detalleVenta.model.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const crearDetalleVenta = (input) => prisma.detalle_Venta.create({
    data: {
        ventaId: input.ventaId,
        libroIsbn: input.libroIsbn,
        precio_unitario: input.precio_unitario,
        subtotal: input.subtotal,
        cantidad: input.cantidad
    }
});
exports.crearDetalleVenta = crearDetalleVenta;
const obtenerDetallePorVenta = (ventaId) => prisma.detalle_Venta.findMany({
    where: { ventaId },
    include: { libro: true },
});
exports.obtenerDetallePorVenta = obtenerDetallePorVenta;

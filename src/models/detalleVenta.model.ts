// src/Models/detalleVenta.model.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const crearDetalleVenta = (input: {
  ventaId: number;
  libroIsbn: number;
  precio_unitario: number;
  subtotal: number;
  cantidad: number;
}) =>
  prisma.detalle_Venta.create({
    data: {
      ventaId: input.ventaId,
      libroIsbn: input.libroIsbn,
      precio_unitario: input.precio_unitario,
      subtotal: input.subtotal,
      cantidad: input.cantidad
    }
  });


export const obtenerDetallePorVenta = (ventaId: number) =>
  prisma.detalle_Venta.findMany({
    where: { ventaId },
    include: { libro: true },
  });

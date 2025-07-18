// src/Models/venta.model.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const obtenerVentas = () =>
  prisma.venta.findMany({
    include: {
      cliente: true,
      detalles: {
        include: {
          libro: true
        }
      }
    }
  });

export const crearVentaConDetalles = async (
  ventaData: {
    id_cliente: number;
    fecha: Date;
    total: number;
    forma_pago: string;
  },
  detalles: Array<{
    libroIsbn: number;
    precio_unitario: number;
    subtotal: number;
    cantidad: number;
  }>
) => {
  return prisma.$transaction(async tx => {
    // Crear venta
    const venta = await tx.venta.create({ data: ventaData });

    // Validar y registrar cada detalle
   await Promise.all(
  detalles.map(async d => {
    const libroExiste = await tx.libro.findUnique({
      where: { isbn: d.libroIsbn }
    });

    if (!libroExiste) {
      throw new Error(`ISBN inválido: ${d.libroIsbn}`);
    }

    console.log("Detalle:", d);

    await tx.detalle_Venta.create({
      data: {
        ventaId: venta.id,
        libroIsbn: d.libroIsbn,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal,
        cantidad: d.cantidad
      }
    });
  })
);


    // Retornar la venta con detalles y cliente incluidos
    return tx.venta.findUnique({
      where: { id: venta.id },
      include: {
        cliente: true,
        detalles: {
          include: {
            libro: true
          }
        }
      }
    });
  });
};


export const obtenerVentaPorId = (id: number) =>
  prisma.venta.findUnique({
    where: { id },
    include: {
      cliente: true,
      detalles: {
        include: {
          libro: true
        }
      }
    }
  });

  
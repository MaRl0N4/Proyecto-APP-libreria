import { Request, Response } from 'express';
import { obtenerVentas, obtenerVentaPorId, crearVentaConDetalles } from '../models/Venta.model';
import { obtenerDetallePorVenta } from '../models/detalleVenta.model';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVentas = async (_req: Request, res: Response) => {
  try {
    const ventas = await obtenerVentas();
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getVentaById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const venta = await obtenerVentaPorId(id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });

    const detalles = await obtenerDetallePorVenta(id);
    res.json({ ...venta, detalles });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const postVenta = async (req: Request, res: Response) => {
  const { id_cliente, fecha, total, forma_pago, detalles } = req.body;

  // Validación básica
  if (
    !id_cliente ||
    !fecha ||
    !total ||
    !forma_pago ||
    !Array.isArray(detalles) ||
    detalles.length === 0
  ) {
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
    const venta = await crearVentaConDetalles(
      {
        id_cliente: Number(id_cliente),
        fecha: new Date(fecha),
        total: Number(total),
        forma_pago
      },
      detallesLimpios
    );

    res.status(201).json({ message: 'Venta registrada correctamente', venta });
  } catch (error: any) {
    console.error('Error al registrar venta:', error.message || error);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

export const getVentasTotales = async (_req: Request, res: Response) => {
  try {
    const ventas = await prisma.ventasTotales.findMany();
    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas totales:", error);
    res.status(500).json({ error: "No se pudo recuperar la vista ventas_totales" });
  }
};


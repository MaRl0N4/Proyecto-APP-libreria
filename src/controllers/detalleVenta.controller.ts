// src/controllers/detalleVenta.controller.ts
import { Request, Response } from 'express';
import {
  crearDetalleVenta,
  obtenerDetallePorVenta,
} from '../models/detalleVenta.model';

export const postDetalleVenta = async (req: Request, res: Response) => {
  try {
    const detalle = await crearDetalleVenta(req.body);
    res.status(201).json(detalle);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear detalle de venta' });
  }
};

export const getDetallesPorVenta = async (req: Request, res: Response) => {
  const ventaId = Number(req.params.venta_id);
  const detalles = await obtenerDetallePorVenta(ventaId);
  res.json(detalles);
};

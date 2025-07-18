// src/controllers/libro.controller.ts
import { RequestHandler } from 'express';
import {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
} from '../models/libro.model';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLibros: RequestHandler = async (_req, res) => {
  const libros = await obtenerLibros();
  res.json(libros);
};

export const getLibroById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const libro = await obtenerLibroPorId(id);
  if (!libro) {
    res.status(404).json({ error: 'Libro no encontrado' });
    return;
  }
  res.json(libro);
};

export const postLibro: RequestHandler = async (req, res) => {
  try {
    const libro = await crearLibro(req.body);
    res.status(201).json(libro);
  } catch (error) {
  const err = error as Error;
  res.status(400).json({ error: 'Error al crear libro', message: err.message });
  }
};

export const putLibro: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const libro = await actualizarLibro(id, req.body);
    res.json(libro);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar libro' });
  }
};

export const deleteLibro: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await eliminarLibro(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar libro' });
  }
};

import { Request, Response } from 'express';

export const getLibrosBestSellerAutores = async (req: Request, res: Response) => {
  try {
    const data = await prisma.librosBestSellerAutores.findMany();
    res.json(data);
  } catch (error) {
    console.error('Error al recuperar best sellers con autores:', error);
    res.status(500).json({ error: 'Error al recuperar libros best seller con autores' });
  }
};


export const getLibrosMasVendidosDetalle = async (req: Request, res: Response) => {
  try {
    const data = await prisma.librosMasVendidosDetalle.findMany();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener libros más vendidos detalle:', error);
    res.status(500).json({ error: 'No se pudo recuperar la vista libros_mas_vendidos_detalle' });
  }
};

export const getLibrosBajaRotacionConVentas = async (_req: Request, res: Response) => {
  try {
    const libros = await prisma.librosBajaRotacionConVentas.findMany();
    res.json(libros);
  } catch (error) {
    console.error("Error al obtener libros de baja rotación:", error);
    res.status(500).json({ error: "No se pudo recuperar la vista libros_baja_rotacion_con_ventas" });
  }
};



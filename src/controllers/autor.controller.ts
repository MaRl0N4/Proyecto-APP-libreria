import { Request, Response } from 'express';
import {
  obtenerAutores,
  obtenerAutorPorId,
  crearAutor,
  actualizarAutor,
  eliminarAutor,
} from '../models/autor.model';

export const getAutores = async (_req: Request, res: Response) => {
  try {
    const autores = await obtenerAutores();
    res.json(autores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener autores' });
  }
};



""
export const getAutorById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido.' });
    }

    const autor = await obtenerAutorPorId(id);
    if (!autor) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el autor' });
  }
};

export const postAutor = async (req: Request, res: Response) => {
  try {
    const nuevoAutor = await crearAutor(req.body);
    res.status(201).json(nuevoAutor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el autor' });
  }
};

export const putAutor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const autorActualizado = await actualizarAutor(id, req.body);
    res.json(autorActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el autor' });
  }
};

export const deleteAutor = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await eliminarAutor(id);
    res.json({ message: 'Autor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el autor' });
  }
};
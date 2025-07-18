import { RequestHandler } from 'express';
import {
  obtenerTodasEditoriales,
  obtenerEditorialPorId,
  crearEditorial,
  actualizarEditorial,
  eliminarEditorial,
  EditorialInput,
} from '../models/editorial.model';

export const getAllEditoriales: RequestHandler = async (_req, res) => {
  try {
    const editoriales = await obtenerTodasEditoriales();
    res.json(editoriales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las editoriales' });
  }
};

export const getEditorialById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    const editorial = await obtenerEditorialPorId(id);
    if (!editorial) {
      res.status(404).json({ error: 'Editorial no encontrada' });
      return;
    }
    res.json(editorial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la editorial' });
  }
};

export const createEditorial: RequestHandler = async (req, res) => {
  const data = req.body as EditorialInput;

  try {
    const nuevaEditorial = await crearEditorial(data);
    res.status(201).json(nuevaEditorial);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la editorial' });
  }
};

export const updateEditorialById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const data = req.body as EditorialInput;

  try {
    const editorialActualizada = await actualizarEditorial(id, data);
    if (!editorialActualizada) {
      res.status(404).json({ error: 'Editorial no encontrada' });
      return;
    }
    res.json(editorialActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la editorial' });
  }
};

export const deleteEditorialById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    await eliminarEditorial(id);
    res.json({ message: 'Editorial eliminada correctamente' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la editorial' });
    return;
  }
};

export default {
  getAllEditoriales,
  getEditorialById,
  createEditorial,  
  updateEditorialById,
  deleteEditorialById,
};

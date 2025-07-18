import { Request, RequestHandler, Response } from 'express';
import {
  obtenerClientes,
  crearCliente,
  eliminarCliente,
  actualizarCliente,
  obtenerClientePorId
} from '../models/cliente.model';

export const getClientes: RequestHandler = async (_req: Request, res: Response) => {
  try {
    const clientes = await obtenerClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};
export const getClienteById: RequestHandler = async (req, res) => {
 const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  try {
    const cliente = await obtenerClientePorId(id);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }}

export const postCliente = async (req: Request, res: Response) => {
  try {
    const nuevoCliente = await crearCliente(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    await eliminarCliente(parseInt(req.params.id));
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

export const putCliente = async (req: Request, res: Response) => {
  try {
    const clienteActualizado = await actualizarCliente(parseInt(req.params.id), req.body);
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

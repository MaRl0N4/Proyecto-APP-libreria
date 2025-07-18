import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerClientes = () => {
  return prisma.cliente.findMany();
};

export const crearCliente = (data: {
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  direccion: string;
  estado: string;
}) => {
  return prisma.cliente.create({ data });
};

export const eliminarCliente = (id: number) => {
  return prisma.cliente.delete({ where: { id } });
};

export const actualizarCliente = (id: number, data: Partial<{
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  direccion: string;
  estado: string;
}>) => {
  return prisma.cliente.update({ where: { id }, data });
};

export const obtenerClientePorId = async (id: number) => {
  return await prisma.cliente.findUnique({ where: { id } });
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type EditorialInput = {
  ruc: string;
  nombre: string;
  telefono: string;
  email: string;
  sitio_web: string;
  estado: string;
};

export const obtenerTodasEditoriales = async () => {
  return await prisma.editorial.findMany();
};

export const obtenerEditorialPorId = async (id: number) => {
  return await prisma.editorial.findUnique({ where: { id } });
};

export const crearEditorial = async (data: EditorialInput) => {
  return await prisma.editorial.create({ data });
};

export const actualizarEditorial = async (id: number, data: EditorialInput) => {
  return await prisma.editorial.update({
    where: { id },
    data,
  });
};

export const eliminarEditorial = async (id: number) => {
  return await prisma.editorial.delete({ where: { id } });
};



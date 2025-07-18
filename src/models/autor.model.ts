import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los autores
export const obtenerAutores = () => {
  return prisma.autor.findMany();
};

// Obtener un autor por su ID
export const obtenerAutorPorId = (id: number) => {
  return prisma.autor.findUnique({ where: { id } });
};

// Crear un nuevo autor
export const crearAutor = (data: {
  nombre: string;
  email: string;
  estado: string;
}) => {
  return prisma.autor.create({ data });
};

// Actualizar un autor existente
export const actualizarAutor = (id: number, data: Partial<{
  nombre: string;
  email: string;
  estado: string;
}>) => {
  return prisma.autor.update({ where: { id }, data });
};

// Eliminar un autor
export const eliminarAutor = (id: number) => {
  return prisma.autor.delete({ where: { id } });
}
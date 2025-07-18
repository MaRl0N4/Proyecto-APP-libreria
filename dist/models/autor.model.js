"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarAutor = exports.actualizarAutor = exports.crearAutor = exports.obtenerAutorPorId = exports.obtenerAutores = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener todos los autores
const obtenerAutores = () => {
    return prisma.autor.findMany();
};
exports.obtenerAutores = obtenerAutores;
// Obtener un autor por su ID
const obtenerAutorPorId = (id) => {
    return prisma.autor.findUnique({ where: { id } });
};
exports.obtenerAutorPorId = obtenerAutorPorId;
// Crear un nuevo autor
const crearAutor = (data) => {
    return prisma.autor.create({ data });
};
exports.crearAutor = crearAutor;
// Actualizar un autor existente
const actualizarAutor = (id, data) => {
    return prisma.autor.update({ where: { id }, data });
};
exports.actualizarAutor = actualizarAutor;
// Eliminar un autor
const eliminarAutor = (id) => {
    return prisma.autor.delete({ where: { id } });
};
exports.eliminarAutor = eliminarAutor;

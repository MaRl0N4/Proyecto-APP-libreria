"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarLibro = exports.actualizarLibro = exports.crearLibro = exports.obtenerLibroPorId = exports.obtenerLibros = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const obtenerLibros = () => {
    return prisma.libro.findMany({
        include: {
            editorial: true,
            autorLibro: {
                include: {
                    autor: true
                }
            }
        }
    });
};
exports.obtenerLibros = obtenerLibros;
const obtenerLibroPorId = (id) => {
    if (!id || isNaN(id)) {
        throw new Error("ID inválido: se esperaba un número para isbn");
    }
    return prisma.libro.findUnique({
        where: { isbn: id },
        include: {
            editorial: true,
            autorLibro: {
                include: {
                    autor: true
                }
            }
        }
    });
};
exports.obtenerLibroPorId = obtenerLibroPorId;
const crearLibro = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevoLibro = yield prisma.libro.create({
        data: {
            isbn: data.isbn,
            titulo: data.titulo,
            precio: data.precio,
            fecha_publicacion: data.fecha_publicacion,
            cantidad_bodega: data.cantidad_bodega,
            estado: data.estado,
            categoria: data.categoria,
            tipo: data.tipo, // <- Campo agregado
            best_seller: data.bestseller,
            editorial: {
                connect: { id: data.editorialId }
            },
            autorLibro: {
                create: data.autorIds.map(id => ({
                    autor: { connect: { id } }
                }))
            }
        }
    });
    return nuevoLibro;
});
exports.crearLibro = crearLibro;
const actualizarLibro = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validar existencia del libro
    const libroExistente = yield prisma.libro.findUnique({ where: { isbn: id } });
    if (!libroExistente)
        throw new Error("Libro no encontrado");
    const updateData = {
        titulo: data.titulo,
        precio: data.precio,
        fecha_publicacion: data.fecha_publicacion,
        cantidad_bodega: data.cantidad_bodega,
        estado: data.estado,
        categoria: data.categoria,
        tipo: data.tipo,
        best_seller: data.best_seller,
    };
    // Actualizar editorial si se proporciona
    if (data.editorialId) {
        updateData.editorial = {
            connect: { id: data.editorialId }
        };
    }
    // Actualizar autores si se proporciona
    if (data.autorIds) {
        // Eliminar relaciones anteriores
        yield prisma.autor_Libro.deleteMany({
            where: { libroId: id } // Asegúrate que este campo es correcto en tu esquema
        });
        updateData.autorLibro = {
            create: data.autorIds.map(autorId => ({
                autor: { connect: { id: autorId } }
            }))
        };
    }
    // Ejecutar actualización
    return prisma.libro.update({
        where: { isbn: id },
        data: updateData,
        include: {
            editorial: true,
            autorLibro: {
                include: {
                    autor: true
                }
            }
        }
    });
});
exports.actualizarLibro = actualizarLibro;
const eliminarLibro = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.autor_Libro.deleteMany({
        where: { libroId: id }
    });
    return prisma.libro.delete({
        where: { isbn: id },
    });
});
exports.eliminarLibro = eliminarLibro;

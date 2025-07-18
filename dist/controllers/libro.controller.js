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
exports.getLibrosBajaRotacionConVentas = exports.getLibrosMasVendidosDetalle = exports.getLibrosBestSellerAutores = exports.deleteLibro = exports.putLibro = exports.postLibro = exports.getLibroById = exports.getLibros = void 0;
const libro_model_1 = require("../models/libro.model");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLibros = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const libros = yield (0, libro_model_1.obtenerLibros)();
    res.json(libros);
});
exports.getLibros = getLibros;
const getLibroById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const libro = yield (0, libro_model_1.obtenerLibroPorId)(id);
    if (!libro) {
        res.status(404).json({ error: 'Libro no encontrado' });
        return;
    }
    res.json(libro);
});
exports.getLibroById = getLibroById;
const postLibro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const libro = yield (0, libro_model_1.crearLibro)(req.body);
        res.status(201).json(libro);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: 'Error al crear libro', message: err.message });
    }
});
exports.postLibro = postLibro;
const putLibro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const libro = yield (0, libro_model_1.actualizarLibro)(id, req.body);
        res.json(libro);
    }
    catch (error) {
        res.status(400).json({ error: 'Error al actualizar libro' });
    }
});
exports.putLibro = putLibro;
const deleteLibro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        yield (0, libro_model_1.eliminarLibro)(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Error al eliminar libro' });
    }
});
exports.deleteLibro = deleteLibro;
const getLibrosBestSellerAutores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.librosBestSellerAutores.findMany();
        res.json(data);
    }
    catch (error) {
        console.error('Error al recuperar best sellers con autores:', error);
        res.status(500).json({ error: 'Error al recuperar libros best seller con autores' });
    }
});
exports.getLibrosBestSellerAutores = getLibrosBestSellerAutores;
const getLibrosMasVendidosDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.librosMasVendidosDetalle.findMany();
        res.json(data);
    }
    catch (error) {
        console.error('Error al obtener libros más vendidos detalle:', error);
        res.status(500).json({ error: 'No se pudo recuperar la vista libros_mas_vendidos_detalle' });
    }
});
exports.getLibrosMasVendidosDetalle = getLibrosMasVendidosDetalle;
const getLibrosBajaRotacionConVentas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const libros = yield prisma.librosBajaRotacionConVentas.findMany();
        res.json(libros);
    }
    catch (error) {
        console.error("Error al obtener libros de baja rotación:", error);
        res.status(500).json({ error: "No se pudo recuperar la vista libros_baja_rotacion_con_ventas" });
    }
});
exports.getLibrosBajaRotacionConVentas = getLibrosBajaRotacionConVentas;

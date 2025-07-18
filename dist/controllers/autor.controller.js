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
exports.deleteAutor = exports.putAutor = exports.postAutor = exports.getAutorById = exports.getAutores = void 0;
const autor_model_1 = require("../models/autor.model");
const getAutores = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const autores = yield (0, autor_model_1.obtenerAutores)();
        res.json(autores);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener autores' });
    }
});
exports.getAutores = getAutores;
"";
const getAutorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'El ID debe ser un número válido.' });
        }
        const autor = yield (0, autor_model_1.obtenerAutorPorId)(id);
        if (!autor) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json(autor);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener el autor' });
    }
});
exports.getAutorById = getAutorById;
const postAutor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevoAutor = yield (0, autor_model_1.crearAutor)(req.body);
        res.status(201).json(nuevoAutor);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear el autor' });
    }
});
exports.postAutor = postAutor;
const putAutor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const autorActualizado = yield (0, autor_model_1.actualizarAutor)(id, req.body);
        res.json(autorActualizado);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar el autor' });
    }
});
exports.putAutor = putAutor;
const deleteAutor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield (0, autor_model_1.eliminarAutor)(id);
        res.json({ message: 'Autor eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar el autor' });
    }
});
exports.deleteAutor = deleteAutor;

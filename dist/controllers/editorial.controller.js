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
exports.deleteEditorialById = exports.updateEditorialById = exports.createEditorial = exports.getEditorialById = exports.getAllEditoriales = void 0;
const editorial_model_1 = require("../models/editorial.model");
const getAllEditoriales = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editoriales = yield (0, editorial_model_1.obtenerTodasEditoriales)();
        res.json(editoriales);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las editoriales' });
    }
});
exports.getAllEditoriales = getAllEditoriales;
const getEditorialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const editorial = yield (0, editorial_model_1.obtenerEditorialPorId)(id);
        if (!editorial) {
            res.status(404).json({ error: 'Editorial no encontrada' });
            return;
        }
        res.json(editorial);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener la editorial' });
    }
});
exports.getEditorialById = getEditorialById;
const createEditorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const nuevaEditorial = yield (0, editorial_model_1.crearEditorial)(data);
        res.status(201).json(nuevaEditorial);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la editorial' });
    }
});
exports.createEditorial = createEditorial;
const updateEditorialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    const data = req.body;
    try {
        const editorialActualizada = yield (0, editorial_model_1.actualizarEditorial)(id, data);
        if (!editorialActualizada) {
            res.status(404).json({ error: 'Editorial no encontrada' });
            return;
        }
        res.json(editorialActualizada);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar la editorial' });
    }
});
exports.updateEditorialById = updateEditorialById;
const deleteEditorialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        yield (0, editorial_model_1.eliminarEditorial)(id);
        res.json({ message: 'Editorial eliminada correctamente' });
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar la editorial' });
        return;
    }
});
exports.deleteEditorialById = deleteEditorialById;
exports.default = {
    getAllEditoriales: exports.getAllEditoriales,
    getEditorialById: exports.getEditorialById,
    createEditorial: exports.createEditorial,
    updateEditorialById: exports.updateEditorialById,
    deleteEditorialById: exports.deleteEditorialById,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const editorial_controller_1 = require("../controllers/editorial.controller");
const router = (0, express_1.Router)();
// Obtener todas las editoriales
router.get('/', editorial_controller_1.getAllEditoriales);
// Obtener una editorial por ID
router.get('/:id', editorial_controller_1.getEditorialById);
// Crear una nueva editorial
router.post('/', editorial_controller_1.createEditorial);
// Actualizar una editorial existente
router.put('/:id', editorial_controller_1.updateEditorialById);
// Eliminar una editorial
router.delete('/:id', editorial_controller_1.deleteEditorialById);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autor_controller_1 = require("../controllers/autor.controller");
const router = (0, express_1.Router)();
// Ensure that getAutorById is a valid Express handler (req, res, next?) => void or Promise<void>
router.get('/', autor_controller_1.getAutores);
router.get('/:id', autor_controller_1.getAutorById);
router.post('/', autor_controller_1.postAutor);
router.put('/:id', autor_controller_1.putAutor);
router.delete('/:id', autor_controller_1.deleteAutor);
exports.default = router;

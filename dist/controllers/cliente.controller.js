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
exports.putCliente = exports.deleteCliente = exports.postCliente = exports.getClienteById = exports.getClientes = void 0;
const cliente_model_1 = require("../models/cliente.model");
const getClientes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield (0, cliente_model_1.obtenerClientes)();
        res.json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener clientes" });
    }
});
exports.getClientes = getClientes;
const getClienteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }
    try {
        const cliente = yield (0, cliente_model_1.obtenerClientePorId)(id);
        if (!cliente) {
            res.status(404).json({ error: 'Cliente no encontrado' });
            return;
        }
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
});
exports.getClienteById = getClienteById;
const postCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevoCliente = yield (0, cliente_model_1.crearCliente)(req.body);
        res.status(201).json(nuevoCliente);
    }
    catch (error) {
        res.status(500).json({ error: "Error al crear el cliente" });
    }
});
exports.postCliente = postCliente;
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, cliente_model_1.eliminarCliente)(parseInt(req.params.id));
        res.json({ message: "Cliente eliminado correctamente" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar el cliente" });
    }
});
exports.deleteCliente = deleteCliente;
const putCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clienteActualizado = yield (0, cliente_model_1.actualizarCliente)(parseInt(req.params.id), req.body);
        res.json(clienteActualizado);
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar el cliente" });
    }
});
exports.putCliente = putCliente;

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
exports.obtenerClientePorId = exports.actualizarCliente = exports.eliminarCliente = exports.crearCliente = exports.obtenerClientes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const obtenerClientes = () => {
    return prisma.cliente.findMany();
};
exports.obtenerClientes = obtenerClientes;
const crearCliente = (data) => {
    return prisma.cliente.create({ data });
};
exports.crearCliente = crearCliente;
const eliminarCliente = (id) => {
    return prisma.cliente.delete({ where: { id } });
};
exports.eliminarCliente = eliminarCliente;
const actualizarCliente = (id, data) => {
    return prisma.cliente.update({ where: { id }, data });
};
exports.actualizarCliente = actualizarCliente;
const obtenerClientePorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.cliente.findUnique({ where: { id } });
});
exports.obtenerClientePorId = obtenerClientePorId;

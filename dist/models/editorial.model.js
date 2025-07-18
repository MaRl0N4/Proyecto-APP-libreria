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
exports.eliminarEditorial = exports.actualizarEditorial = exports.crearEditorial = exports.obtenerEditorialPorId = exports.obtenerTodasEditoriales = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const obtenerTodasEditoriales = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.editorial.findMany();
});
exports.obtenerTodasEditoriales = obtenerTodasEditoriales;
const obtenerEditorialPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.editorial.findUnique({ where: { id } });
});
exports.obtenerEditorialPorId = obtenerEditorialPorId;
const crearEditorial = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.editorial.create({ data });
});
exports.crearEditorial = crearEditorial;
const actualizarEditorial = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.editorial.update({
        where: { id },
        data,
    });
});
exports.actualizarEditorial = actualizarEditorial;
const eliminarEditorial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.editorial.delete({ where: { id } });
});
exports.eliminarEditorial = eliminarEditorial;

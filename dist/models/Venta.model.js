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
exports.obtenerVentaPorId = exports.crearVentaConDetalles = exports.obtenerVentas = void 0;
// src/Models/venta.model.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const obtenerVentas = () => prisma.venta.findMany({
    include: {
        cliente: true,
        detalles: {
            include: {
                libro: true
            }
        }
    }
});
exports.obtenerVentas = obtenerVentas;
const crearVentaConDetalles = (ventaData, detalles) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Crear venta
        const venta = yield tx.venta.create({ data: ventaData });
        // Validar y registrar cada detalle
        yield Promise.all(detalles.map((d) => __awaiter(void 0, void 0, void 0, function* () {
            const libroExiste = yield tx.libro.findUnique({
                where: { isbn: d.libroIsbn }
            });
            if (!libroExiste) {
                throw new Error(`ISBN inválido: ${d.libroIsbn}`);
            }
            console.log("Detalle:", d);
            yield tx.detalle_Venta.create({
                data: {
                    ventaId: venta.id,
                    libroIsbn: d.libroIsbn,
                    precio_unitario: d.precio_unitario,
                    subtotal: d.subtotal,
                    cantidad: d.cantidad
                }
            });
        })));
        // Retornar la venta con detalles y cliente incluidos
        return tx.venta.findUnique({
            where: { id: venta.id },
            include: {
                cliente: true,
                detalles: {
                    include: {
                        libro: true
                    }
                }
            }
        });
    }));
});
exports.crearVentaConDetalles = crearVentaConDetalles;
const obtenerVentaPorId = (id) => prisma.venta.findUnique({
    where: { id },
    include: {
        cliente: true,
        detalles: {
            include: {
                libro: true
            }
        }
    }
});
exports.obtenerVentaPorId = obtenerVentaPorId;

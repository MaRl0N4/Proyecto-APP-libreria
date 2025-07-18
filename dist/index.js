"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const editorial_routes_1 = __importDefault(require("./routes/editorial.routes")); // minúsculas para evitar confusiones
const venta_routes_1 = __importDefault(require("./routes/venta.routes"));
const detalleVenta_routes_1 = __importDefault(require("./routes/detalleVenta.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const libro_routes_1 = __importDefault(require("./routes/libro.routes"));
const autor_routes_1 = __importDefault(require("./routes/autor.routes"));
// Configuración del servidor Express
const app = (0, express_1.default)();
const port = 3000;
// Middleware para manejar JSON y URL-encoded
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configuración de las rutas
app.use('/api/editoriales', editorial_routes_1.default);
app.use('/api/clientes', cliente_routes_1.default);
app.use('/api/ventas', venta_routes_1.default);
app.use('/api/detalle-venta', detalleVenta_routes_1.default);
app.use('/api/libros', libro_routes_1.default);
app.use('/api/autores', autor_routes_1.default);
// Configuración de la carpeta de vistas y archivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, 'views')));
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', 'index.html'));
});
// Puerto de escucha
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

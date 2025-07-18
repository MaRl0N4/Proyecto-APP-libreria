import express from 'express';
import path from 'path';
import editorialRoutes from './routes/editorial.routes'; // minúsculas para evitar confusiones
import ventaRoutes from './routes/venta.routes';
import detalleVentaRoutes from './routes/detalleVenta.routes';
import clienteRoutes from './routes/cliente.routes';
import libroRoutes from './routes/libro.routes';
import autorRoutes from './routes/autor.routes';


// Configuración del servidor Express
const app = express();
const port = 3000;


// Middleware para manejar JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de las rutas
app.use('/api/editoriales', editorialRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/detalle-venta', detalleVentaRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/autores', autorRoutes);



// Configuración de la carpeta de vistas y archivos estáticos
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// Puerto de escucha
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

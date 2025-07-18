-- CreateTable
CREATE TABLE "Editorial" (
    "id" SERIAL NOT NULL,
    "ruc" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(75) NOT NULL,
    "telefono" VARCHAR(12) NOT NULL,
    "email" VARCHAR(35) NOT NULL,
    "sitio_web" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,

    CONSTRAINT "Editorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Autor" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Libro" (
    "isbn" INTEGER NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "editorialId" INTEGER,
    "precio" DOUBLE PRECISION NOT NULL,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL,
    "cantidad_bodega" INTEGER NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "categoria" VARCHAR(60) NOT NULL,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "Autor_Libro" (
    "autorId" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,

    CONSTRAINT "Autor_Libro_pkey" PRIMARY KEY ("autorId","libroId")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombres" VARCHAR(30) NOT NULL,
    "apellidos" VARCHAR(30) NOT NULL,
    "cedula" VARCHAR(15) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "direccion" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "id_cliente" INTEGER,
    "forma_pago" VARCHAR(20),

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalle_Venta" (
    "id" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "libroId" INTEGER,
    "precio_unitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Detalle_Venta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_editorialId_fkey" FOREIGN KEY ("editorialId") REFERENCES "Editorial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autor_Libro" ADD CONSTRAINT "Autor_Libro_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Autor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autor_Libro" ADD CONSTRAINT "Autor_Libro_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro"("isbn") ON DELETE SET NULL ON UPDATE CASCADE;

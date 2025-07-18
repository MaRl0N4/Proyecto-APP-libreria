-- CreateTable
CREATE TABLE "libros_best_seller_autores" (
    "isbn" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "autores" TEXT NOT NULL,

    CONSTRAINT "libros_best_seller_autores_pkey" PRIMARY KEY ("isbn")
);

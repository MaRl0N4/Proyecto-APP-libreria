/*
  Warnings:

  - You are about to drop the column `libroId` on the `Detalle_Venta` table. All the data in the column will be lost.
  - Added the required column `libroIsbn` to the `Detalle_Venta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Libro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Detalle_Venta" DROP CONSTRAINT "Detalle_Venta_libroId_fkey";

-- AlterTable
ALTER TABLE "Detalle_Venta" DROP COLUMN "libroId",
ADD COLUMN     "libroIsbn" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Libro" ADD COLUMN     "tipo" VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_libroIsbn_fkey" FOREIGN KEY ("libroIsbn") REFERENCES "Libro"("isbn") ON DELETE SET NULL ON UPDATE CASCADE;

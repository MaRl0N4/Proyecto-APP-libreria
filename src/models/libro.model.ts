import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const obtenerLibros = () => {
  return prisma.libro.findMany({
    include: {
      editorial: true,
      autorLibro: {
        include: {
          autor: true
        }
      }
    }
  });
};


export const obtenerLibroPorId = (id: number) => {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido: se esperaba un número para isbn");
  }

  return prisma.libro.findUnique({
    where: { isbn: id },
    include: {
      editorial: true,
      autorLibro: {
        include: {
          autor: true
        }
      }
    }
  });
};



export const crearLibro = async (data: {
  isbn: number;
  titulo: string;
  editorialId: number;
  precio: number;
  fecha_publicacion: Date;
  cantidad_bodega: number;
  estado: string;
  categoria: string;
  tipo: string; // Nuevo campo para indicar el tipo de libro
  bestseller: boolean;
  autorIds: number[]; // Ahora soporta múltiples autores
}) => {
  const nuevoLibro = await prisma.libro.create({
    data: {
      isbn: data.isbn,
      titulo: data.titulo,
      precio: data.precio,
      fecha_publicacion: data.fecha_publicacion,
      cantidad_bodega: data.cantidad_bodega,
      estado: data.estado,
      categoria: data.categoria,
      tipo: data.tipo, // <- Campo agregado
      best_seller: data.bestseller,
      editorial: {
        connect: { id: data.editorialId }
      },
      autorLibro: {
        create: data.autorIds.map(id => ({
          autor: { connect: { id } }
        }))
      }
    }
  });

  return nuevoLibro;
};




export const actualizarLibro = async (
  id: number,
  data: {
    titulo?: string;
    precio?: number;
    fecha_publicacion?: Date;
    cantidad_bodega?: number;
    estado?: string;
    categoria?: string;
    tipo?: string;
    best_seller?: boolean;
    editorialId?: number;
    autorIds?: number[];
  }
) => {
  // Validar existencia del libro
  const libroExistente = await prisma.libro.findUnique({ where: { isbn: id } });
  if (!libroExistente) throw new Error("Libro no encontrado");

  const updateData: any = {
    titulo: data.titulo,
    precio: data.precio,
    fecha_publicacion: data.fecha_publicacion,
    cantidad_bodega: data.cantidad_bodega,
    estado: data.estado,
    categoria: data.categoria,
    tipo: data.tipo,
    best_seller: data.best_seller,
  };

  // Actualizar editorial si se proporciona
  if (data.editorialId) {
    updateData.editorial = {
      connect: { id: data.editorialId }
    };
  }

  // Actualizar autores si se proporciona
  if (data.autorIds) {
    // Eliminar relaciones anteriores
    await prisma.autor_Libro.deleteMany({
      where: { libroId: id } // Asegúrate que este campo es correcto en tu esquema
    });

    updateData.autorLibro = {
      create: data.autorIds.map(autorId => ({
        autor: { connect: { id: autorId } }
      }))
    };
  }

  // Ejecutar actualización
  return prisma.libro.update({
    where: { isbn: id },
    data: updateData,
    include: {
      editorial: true,
      autorLibro: {
        include: {
          autor: true
        }
      }
    }
  });
};



export const eliminarLibro = async (id: number) => {
  await prisma.autor_Libro.deleteMany({
    where: { libroId: id }
  });

  return prisma.libro.delete({
    where: { isbn: id },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const tipoReporte = document.getElementById("tipo-reporte");
  const contenedorTabla = document.getElementById("reporte-tabla-container");
  const selectOrden = document.getElementById("orden-select");
  const selectCategoria = document.getElementById("categoria-select");
  let seccionesReporte = [];

  tipoReporte.innerHTML = `
    <option value="">--Seleccione--</option>
    <option value="ventasMensuales">Ventas mensuales</option>
    <option value="bajaRotacion">Libros de baja rotación</option>
    <option value="masVendidosPorCategoria">Libros más vendidos por categoria</option>
    <option value="bestSellers">Libros best Sellers</option>
  `;

  tipoReporte.addEventListener("change", renderPorTipo);

  function renderPorTipo() {
    const tipo = tipoReporte.value;
    contenedorTabla.innerHTML = "";
    selectOrden.style.display = "none";
    selectCategoria.style.display = "none";
    seccionesReporte = [];

    if (tipo === "ventasMensuales") {
      renderVentasMensualesPorMes();
    } else if (tipo === "bajaRotacion") {
      fetchBajaRotacion();
    } else if (tipo === "masVendidosPorCategoria") {
      renderTodasCategorias();
    } else if (tipo === "bestSellers") {
      fetchBestSellerReport();
    }
  }

 async function renderVentasMensualesPorMes() {
  seccionesReporte = [];

  try {
    const response = await fetch("/api/ventas/totales");
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      contenedorTabla.innerHTML = "<p>No hay ventas registradas.</p>";
      return;
    }

    const meses = {
      "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
      "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
      "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
    };

    const ventasPorMes = {};
    data.forEach(v => {
      const mes = v.fecha.split("-")[1];
      if (!ventasPorMes[mes]) ventasPorMes[mes] = [];
      ventasPorMes[mes].push(v);
    });

    contenedorTabla.innerHTML = "";

    Object.entries(ventasPorMes).forEach(([mes, ventas]) => {
      const nombreMes = meses[mes] || mes;

      const rows = ventas.map(v => {
        const monto = parseFloat(v.total);
        const fechaSolo = v.fecha.split("T")[0];
const [año, mes, día] = fechaSolo.split("-");
const fechaFormateada = `${día}/${mes}/${año}`;
return [v.venta_id, fechaFormateada, `$${monto.toFixed(2)}`];

      });

      const headers = ["ID Venta", "Fecha", "Monto"];
      const tablaHTML = renderReporteHTML(headers, rows);

      const totalVendidos = ventas.reduce((sum, v) => {
        const monto = parseFloat(v.total);
        return sum + (isNaN(monto) ? 0 : monto);
      }, 0);

      contenedorTabla.innerHTML += `
        <h3>${nombreMes}</h3>
        ${tablaHTML}
        <p><strong>Total de ventas: ${ventas.length}</strong></p>
        <p><strong>Total vendido: $${totalVendidos.toFixed(2)}</strong></p>
        <hr>
      `;

      seccionesReporte.push({
        categoria: `Ventas - ${nombreMes}`,
        tablaHTML,
        totalLibros: ventas.length,
        totalVendidos: totalVendidos
      });
    });

  } catch (error) {
    console.error("Error al obtener ventas mensuales:", error);
    contenedorTabla.innerHTML = "<p>Error al cargar el reporte.</p>";
  }
}

  
async function fetchBajaRotacion() {
  seccionesReporte = [];

  try {
    const response = await fetch("/api/libros/baja-rotacion");
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      contenedorTabla.innerHTML = "<p>No hay libros de baja rotación registrados.</p>";
      return;
    }

    const headers = ["ISBN", "Título", "Ventas"];
    const rows = data.map(v => [v.isbn, v.titulo, v.cantidad_ventas]);
    const tablaHTML = renderReporteHTML(headers, rows);
    contenedorTabla.innerHTML = tablaHTML;

    const totalVendidos = data.reduce((sum, v) => sum + v.cantidad_ventas, 0);
    contenedorTabla.innerHTML += `
      <p><strong>Total de libros: ${data.length}</strong></p>
      <p><strong>Total vendidos: ${totalVendidos}</strong></p>
    `;

    seccionesReporte.push({
      categoria: "Libros de baja rotación",
      tablaHTML,
      totalLibros: data.length,
      totalVendidos
    });
  } catch (error) {
    console.error("Error al obtener libros de baja rotación:", error);
    contenedorTabla.innerHTML = "<p>Error al cargar el reporte.</p>";
  }
}


  async function renderTodasCategorias() {
    seccionesReporte = [];

    try {
      const response = await fetch("http://localhost:3000/api/libros/mas-vendidos-detalle");
      const data = await response.json();
      const categorias = [...new Set(data.map(libro => libro.categoria))];

      contenedorTabla.innerHTML = "";

      categorias.forEach(categoria => {
        const librosCategoria = data.filter(libro => libro.categoria === categoria);
        if (librosCategoria.length === 0) return;

        const rows = librosCategoria.map(libro => [
          libro.isbn,
          libro.titulo,
          libro.autor,
          libro.editorial || "—",
          `$${libro.precio.toFixed(2)}`,
          libro.tipo,
          libro.best_seller ? "Sí" : "No",
          libro.cantidad_vendida
        ]);

        const totalCantidad = librosCategoria.reduce((sum, libro) => sum + libro.cantidad_vendida, 0);

        contenedorTabla.innerHTML += `
          <h3>${categoria}</h3>
          ${renderReporteHTML(["ISBN", "Título", "Autor", "Editorial", "Precio", "Tipo", "Best Seller", "Cantidad Vendida"], rows)}
          <p><strong>Total de libros: ${librosCategoria.length}</strong></p>
          <p><strong>Total vendidos: ${totalCantidad}</strong></p>
          <hr>
        `;

        seccionesReporte.push({
          categoria,
          tablaHTML: renderReporteHTML(["ISBN", "Título", "Autor", "Editorial", "Precio", "Tipo", "Best Seller", "Cantidad Vendida"], rows),
          totalLibros: librosCategoria.length,
          totalVendidos: totalCantidad
        });
      });

    } catch (error) {
      console.error("Error al cargar las categorías:", error);
      contenedorTabla.innerHTML = "<p>Error al cargar el reporte.</p>";
    }
  }

  async function fetchBestSellerReport() {
    try {
      const response = await fetch("/api/libros/best-seller-autores");
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        contenedorTabla.innerHTML = "<p>No hay libros best seller registrados.</p>";
        return;
      }

      const rows = data.map(libro => [libro.isbn, libro.titulo, libro.categoria, libro.autores]);
      renderReporte(["ISBN", "Título", "Categoría", "Autores"], rows);
    } catch (error) {
      console.error("Error al obtener el reporte de libros best seller:", error);
      contenedorTabla.innerHTML = "<p>Error al cargar el reporte.</p>";
    }
  }

  function renderReporteHTML(headers, rows) {
    let html = `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>`;
    rows.forEach(row => {
      html += `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`;
    });
    html += "</tbody></table>";
    return html;
  }

  function renderReporte(headers, rows) {
    contenedorTabla.innerHTML = renderReporteHTML(headers, rows);
  }

  // Modal descarga
  document.getElementById("descargar-reporte").addEventListener("click", () => {
    document.getElementById("modal-formato").style.display = "flex";
  });

  document.getElementById("cerrar-modal-formato").addEventListener("click", () => {
    document.getElementById("modal-formato").style.display = "none";
  });

 document.getElementById("btn-descargar-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    const tipoTexto = tipoReporte.options[tipoReporte.selectedIndex].text;
    doc.text(tipoTexto, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 10;

    seccionesReporte.forEach(section => {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Categoría: ${section.categoria}`, 14, y);
      y += 8;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Total de libros: ${section.totalLibros}`, 14, y);
      y += 6;
      doc.text(`Total vendidos: ${section.totalVendidos}`, 14, y);
      y += 6;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = section.tablaHTML;
      const tabla = tempDiv.querySelector("table");

      doc.autoTable({
        html: tabla,
        startY: y
      });

      y = doc.lastAutoTable.finalY + 6;

      doc.setDrawColor(180);
      doc.setLineWidth(0.3);
      doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y);
      y += 6;
    });

    doc.setFontSize(10);
    doc.text("Librería TODOLIBROS", 14, doc.internal.pageSize.getHeight() - 10);
    doc.save("reporte.pdf");
    document.getElementById("modal-formato").style.display = "none";
  });

  document.getElementById("btn-descargar-csv").addEventListener("click", () => {
    const tablas = document.querySelectorAll("#reporte-tabla-container table");
    if (!tablas.length) return alert("No hay datos para exportar.");

    let csv = [];
    tablas.forEach(tabla => {
      const rows = tabla.querySelectorAll("tr");
      rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        const datos = [...cols].map(col => `"${col.innerText}"`);
        csv.push(datos.join(","));
      });
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte.csv";
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById("modal-formato").style.display = "none";
  });



  document.getElementById("btn-descargar-csv").addEventListener("click", () => {
    const tablas = document.querySelectorAll("#reporte-tabla-container table");
    if (!tablas.length) return alert("No hay datos para exportar.");

    let csv = [];
    tablas.forEach(tabla => {
      const rows = tabla.querySelectorAll("tr");
      rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        const datos = [...cols].map(col => `"${col.innerText}"`);
        csv.push(datos.join(","));
      });
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte.csv";
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById("modal-formato").style.display = "none";
  });
});

function agregarLibro() {
  if (!libroOptionsHTML) {
    console.warn("Opciones de libros no disponibles todavía");
    return;
  }

  const container = document.getElementById("librosContainer");
  const div = document.createElement("div");
  div.className = "libro-item";

  // 💡 Contenido visual estilo tarjeta
  div.innerHTML = `
    <div class="libro-card">
      <label>Libro:</label>
      <select name="libroIsbn" required>${libroOptionsHTML}</select>

      <label>Cantidad:</label>
      <input type="number" name="cantidad" required min="1" />

      <label>Precio Unitario:</label>
      <input type="number" name="precio_unitario" required readonly />

      <button type="button" class="btn-remove-libro">Eliminar</button>
    </div>
  `;

  container.appendChild(div);

  const select = div.querySelector("select");
  const inputPrecio = div.querySelector('input[name="precio_unitario"]');
  const btnRemove = div.querySelector(".btn-remove-libro");

  // Actualizar precio cuando se selecciona libro
  select.addEventListener("change", (e) => {
    const precio = libroPrecioMap[e.target.value] || 0;
    inputPrecio.value = precio;
  });

  // Precio inicial si hay libro preseleccionado
  if (select.value) {
    inputPrecio.value = libroPrecioMap[select.value] || 0;
  }

  // Eliminar bloque de libro
  btnRemove.addEventListener("click", () => {
    div.remove();
  });
}

let libroPrecioMap = {}; // ✅ definido en el ámbito global

let libroOptionsHTML = "";
document.addEventListener("DOMContentLoaded", () => {
  const btnConsultar = document.getElementById("btn-consultar");
  const tablaBody = document.querySelector("tbody");
  const btnAgregar = document.querySelector(".btn-agregar");


  // Cargar clientes
  fetch("/api/clientes")
    .then(res => res.json())
    .then(clientes => {
      const select = document.getElementById("idcliente");
      clientes.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = `${c.nombres} ${c.apellidos}`;
        select.appendChild(option);
      });
    });

    const btnAgregarLibro = document.getElementById("btn-agregar-libro");
  if (btnAgregarLibro) {
    btnAgregarLibro.addEventListener("click", agregarLibro);
  }



  

  const selectLibro = document.getElementById("articulo");


  if (selectLibro) {
    fetch("/api/libros")
      .then(res => res.json())
      .then(libros => {
        libros.forEach(libro => {
          const option = document.createElement("option");
          option.value = libro.isbn;
          option.textContent = libro.titulo;
          selectLibro.appendChild(option);
          libroPrecioMap[libro.isbn] = libro.precio;
        });

        // Guardar opciones como plantilla para usar en agregarLibro()
        libroOptionsHTML = selectLibro.innerHTML;
      });
  } else {
    console.warn("Elemento #articulo no está en el DOM.");
  }

  document.getElementById("cancelar-agregar").addEventListener("click", () => {
    document.getElementById("modal-agregar").style.display = "none";
  });

  document.getElementById("cerrar-modal-agregar").addEventListener("click", () => {
    document.getElementById("modal-agregar").style.display = "none";
  });

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
  });

  document.getElementById("cerrar-modal-factura").addEventListener("click", () => {
    document.getElementById("modal-factura").style.display = "none";
  });

  



function renderTablaFacturas() {
  fetch("/api/ventas")
    .then(res => res.json())
    .then(facturas => {
      const tablaBody = document.querySelector("tbody");
      tablaBody.innerHTML = "";

      if (!Array.isArray(facturas)) {
        console.error("Respuesta inesperada:", facturas);
        alert("No se pudieron cargar las facturas.");
        return;
      }

      facturas.forEach(factura => {
       const titulos = factura.detalles
  .map((d, i) => `${i + 1}. ${d.libro.titulo}`)
  .join('<br>');

const cantidades = factura.detalles
  .map(d => `${d.cantidad}`)
  .join('<br>');

const totalSubtotal = factura.detalles
  .reduce((sum, d) => sum + d.subtotal, 0)
  .toFixed(2);




        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${factura.id}</td>
          <td>${titulos}</td>
          <td>${cantidades}</td>
         <td>$${totalSubtotal}</td>
          <td>${parseFloat(factura.total).toFixed(2)}</td>
          <td>
            <button class="btn-detalle" data-id="${factura.id}">Ver detalle</button>
            <button class="btn-descargar-factura" data-id="${factura.id}">Descargar</button>
          </td>
        `;
        tablaBody.appendChild(row);
      });

      document.querySelectorAll(".btn-detalle").forEach(btn =>
        btn.addEventListener("click", verDetalleFactura)
      );
      document.querySelectorAll(".btn-descargar-factura").forEach(btn =>
        btn.addEventListener("click", mostrarModalFactura)
      );
    });
}



  document.getElementById("btn-consultar").addEventListener("click", () => {
  const idBuscado = document.getElementById("buscar").value.trim();
  const tablaBody = document.querySelector("tbody");

  // Limpiar tabla antes de mostrar resultados
  tablaBody.innerHTML = "";

  // 🔍 Si el input está vacío, mostrar todas las facturas
  if (!idBuscado) {
    renderTablaFacturas();
    return;
  }

  // 🛡 Validar que el ID sea numérico
  if (isNaN(idBuscado)) {
    alert("Ingrese un ID numérico válido");
    return;
  }

  // 🔎 Buscar factura por ID
  fetch(`/api/ventas/${idBuscado}`)
    .then(res => {
      if (!res.ok) throw new Error("Factura no encontrada");
      return res.json();
    })
    .then(factura => {
      renderFacturaEnTabla(factura);
    })
    .catch(err => {
      console.error("Error:", err);
      alert("No se encontró ninguna factura con ese ID.");
    });
});

  function renderFacturaEnTabla(factura) {
  const tablaBody = document.querySelector("tbody");
  tablaBody.innerHTML = "";

  factura.detalles.forEach(detalle => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${factura.id}</td>
      <td>${detalle.libro?.titulo || '-'}</td>
      <td>${detalle.cantidad}</td>
      <td>${detalle.subtotal?.toFixed(2)}</td>
      <td>${parseFloat(factura.total).toFixed(2)}</td>
      <td>
        <button class="btn-detalle" data-id="${factura.id}">Ver detalle</button>
        <button class="btn-descargar-factura" data-id="${factura.id}">Descargar</button>
      </td>
    `;
    tablaBody.appendChild(row);
  });

  // 🎯 Reactivar botones
  document.querySelectorAll(".btn-detalle").forEach(btn =>
    btn.addEventListener("click", verDetalleFactura)
  );
  document.querySelectorAll(".btn-descargar-factura").forEach(btn =>
    btn.addEventListener("click", mostrarModalFactura)
  );
}



  btnAgregar.addEventListener("click", () => {
    
    document.getElementById("form-agregar").reset();
    prepararModalAgregarVenta()
    document.getElementById("modal-agregar").style.display = "block";
  });

  function prepararModalAgregarVenta() {
  const modal = document.getElementById("modal-agregar");
  modal.style.display = "block";

  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split("T")[0];
    fechaInput.value = fechaFormateada;
  }
   document.getElementById("librosContainer").innerHTML = ""; // Limpiar por si quedó algo
  agregarLibro(); // ✅ Cargar una línea de libro por defecto
}


document.getElementById("form-agregar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const idFactura = form.getAttribute("data-id"); // Si existe, es edición

  // 📦 Datos base de la venta
  const idcliente = parseInt(form.idcliente.value);
  const fecha = form.fecha.value;
  const tipo_pago = form.tipo_pago.value;

  const detalles = [];

  // 🔁 Recorrer cada bloque de libro
  document.querySelectorAll(".libro-item").forEach((item) => {
    const libroIsbn = parseInt(item.querySelector("[name='libroIsbn']").value);
    const cantidad = parseInt(item.querySelector("[name='cantidad']").value);
    const precioUnitario = parseFloat(item.querySelector("[name='precio_unitario']").value);
    const subtotal = precioUnitario * cantidad;

    detalles.push({
      libroIsbn,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal: parseFloat(subtotal.toFixed(2))
    });
  });

  if (detalles.length === 0) {
    alert("Debe agregar al menos un libro a la venta.");
    return;
  }

  // 💰 Cálculo de total con IVA (15%)
  const totalSinIVA = detalles.reduce((acc, d) => acc + d.subtotal, 0);
  const total = parseFloat((totalSinIVA * 1.15).toFixed(2));

  const ventaData = {
    fecha,
    forma_pago: tipo_pago,
    id_cliente: idcliente,
    total,
    detalles
  };

  const url = idFactura ? `/api/ventas/${idFactura}` : "/api/ventas";
  const method = idFactura ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ventaData)
    });

    if (!response.ok) throw new Error("Error al guardar la venta");
    const result = await response.json();

    alert(idFactura ? "Factura actualizada correctamente." : "Venta registrada exitosamente.");
    form.removeAttribute("data-id");
    form.reset();
    document.getElementById("modal-agregar").style.display = "none";
    renderTablaFacturas();
  } catch (err) {
    console.error("Error:", err);
    alert("Ocurrió un problema al registrar la venta.");
  }
});



 function verDetalleFactura(e) {
  const idFactura = e.target.dataset.id;

  fetch(`/api/ventas/${idFactura}`)
    .then(res => res.json())
    .then(factura => {
      // 🧑‍💼 Datos del cliente
      document.getElementById("detalle-cliente").textContent =
        factura.cliente.nombres + " " + factura.cliente.apellidos;
      document.getElementById("detalle-idcliente").textContent = factura.id_cliente;
      document.getElementById("detalle-fecha").textContent = factura.fecha.split("T")[0];
      document.getElementById("detalle-tipopago").textContent = factura.forma_pago;

      // 📚 Detalles de libros en tabla
      const tbody = document.getElementById("detalle-libros");
      tbody.innerHTML = ""; // Limpiar contenido anterior

      factura.detalles.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${d.libro.titulo}</td>
          <td>${d.cantidad}</td>
          <td>$${d.precio_unitario.toFixed(2)}</td>
          <td>$${d.subtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });

      // Mostrar modal
      document.getElementById("modal").style.display = "block";
    });
}



function mostrarModalFactura(e) {
  const idFactura = e.target.dataset.id;

  fetch(`/api/ventas/${idFactura}`)
    .then(res => res.json())
    .then(factura => {
      // 💰 Cálculo total de IVA y subtotal
      const subtotalGlobal = factura.detalles.reduce((acc, d) => acc + d.subtotal, 0);
      const iva = parseFloat((subtotalGlobal * 0.15).toFixed(2));
      const total = parseFloat(factura.total).toFixed(2);

      // 🧑‍💼 Datos principales
      document.getElementById("f-id").textContent = factura.id;
      document.getElementById("f-cliente").textContent = factura.cliente.nombres + ' ' + factura.cliente.apellidos;
      document.getElementById("f-idcliente").textContent = factura.id_cliente;
      document.getElementById("f-fecha").textContent = factura.fecha.split("T")[0];
      document.getElementById("f-tipopago").textContent = factura.forma_pago;
      document.getElementById("f-iva").textContent = iva.toFixed(2);
      document.getElementById("f-total").textContent = total;

      // 📚 Renderizar libros vendidos en tabla
      const tbody = document.getElementById("factura-libros");
      tbody.innerHTML = "";

      factura.detalles.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${d.libro.titulo}</td>
          <td>${d.cantidad}</td>
          <td>$${d.precio_unitario.toFixed(2)}</td>
          <td>$${d.subtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });

      // Mostrar modal
      document.getElementById("modal-factura").style.display = "block";
    });
}



 document.getElementById("btn-generar-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  fetch(`/api/ventas/${document.getElementById("f-id").textContent}`)
    .then(res => res.json())
    .then(factura => {
      doc.setFontSize(18);
      doc.text("TODOLIBROS", 105, 20, null, null, "center");

      doc.setFontSize(12);
      doc.text("RUC: 1234567890001", 105, 28, null, null, "center");
      doc.text("Av. Libros #456, Quito, Ecuador", 105, 34, null, null, "center");

      doc.line(20, 38, 190, 38);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("FACTURA DE VENTA", 105, 46, null, null, "center");

      let y = 60;
      
      // Datos principales
      doc.setFontSize(12);
      doc.text(`Codigo de referencia: ${factura.id}`, 25, y); y += 8;
      doc.text(`Fecha: ${factura.fecha.split("T")[0]}`, 25, y); y += 8;
      doc.text(`Cliente: ${factura.cliente.nombres} ${factura.cliente.apellidos}`, 25, y); y += 8;
      doc.text(`ID Cliente: ${factura.id_cliente}`, 25, y); y += 8;
      doc.text(`Forma de pago: ${factura.forma_pago}`, 25, y); y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("ARTÍCULOS VENDIDOS:", 25, y);
      y += 8;

      // 📚 Tabla de libros vendidos
      const librosData = factura.detalles.map(d => [
        d.libro.titulo,
        d.cantidad,
        `$${d.precio_unitario.toFixed(2)}`,
        `$${d.subtotal.toFixed(2)}`
      ]);

      doc.autoTable({
        startY: y,
        head: [["Libro", "Cantidad", "Precio Unitario", "Subtotal"]],
        body: librosData,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [230, 230, 230] },
        margin: { left: 25, right: 25 }
      });

      y = doc.lastAutoTable.finalY + 10;

      // 🧮 Totales
      const subtotal = factura.detalles.reduce((acc, d) => acc + d.subtotal, 0);
      const iva = parseFloat((subtotal * 0.15).toFixed(2));
      const total = parseFloat(factura.total).toFixed(2);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 150, 243);
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 25, y); y += 8;
      doc.text(`IVA (15%): $${iva.toFixed(2)}`, 25, y); y += 8;
      doc.text(`Total a pagar: $${total}`, 25, y); y += 10;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Gracias por su compra", 105, 270, null, null, "center");

      doc.save(`Factura_${factura.id}.pdf`);
      document.getElementById("modal-factura").style.display = "none";
    });
});



  renderTablaFacturas();
});

document.addEventListener("DOMContentLoaded", () => {
  const btnConsultar = document.querySelector(".btn-consultar");
  const btnAgregar = document.querySelector(".btn-agregar");
  const tablaBody = document.querySelector("tbody");
  let libros = [];

  async function obtenerAutores() {
    const res = await fetch('/api/autores');
    return res.ok ? await res.json() : [];
  }

  async function obtenerEditoriales() {
    const res = await fetch('/api/editoriales');
    return res.ok ? await res.json() : [];
  }

  async function cargarLibros() {
    try {
      const res = await fetch('/api/libros');
      if (!res.ok) throw new Error('Error al cargar libros');
      libros = await res.json();
      renderTabla();
    } catch (error) {
      alert(error.message);
    }
  }

  function renderTabla(data = libros) {
    tablaBody.innerHTML = "";
    data.forEach((libro, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${libro.isbn}</td>
        <td>${libro.titulo}</td>
       <td>${libro.autorLibro?.map(a => a.autor.nombre).join(", ") || "—"}</td>
        <td>${libro.categoria}</td>
        <td>${libro.editorial?.nombre || "—"}</td>
        <td>${libro.tipo || "—"}</td>
        <td>$${libro.precio.toFixed(2)}</td>
        <td>${libro.fecha_publicacion?.split("T")[0] || ""}</td>
        <td>${libro.cantidad_bodega}</td>
        <td>${libro.best_seller ? "Sí" : "No"}</td>
        <td>${libro.estado}</td>
        <td>
          <button class="btn-eliminar" data-index="${index}">Eliminar</button>
          <button class="btn-editar" data-index="${index}">Editar</button>
        </td>
      `;
      tablaBody.appendChild(row);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn =>
      btn.addEventListener("click", eliminarLibro)
    );
    document.querySelectorAll(".btn-editar").forEach(btn =>
      btn.addEventListener("click", editarLibro)
    );
  }

  btnConsultar.addEventListener("click", async () => {
    const isbn = document.getElementById("buscar").value.trim();
    if (!isbn) return cargarLibros();

    try {
      const res = await fetch(`/api/libros/${isbn}`);
      if (!res.ok) {
        tablaBody.innerHTML = "<tr><td colspan='12'>No se encontró ningún libro con ese ISBN.</td></tr>";
        return;
      }
      const libro = await res.json();
      renderTabla([libro]);
    } catch (error) {
      alert(error.message);
    }
  });

  btnAgregar.addEventListener("click", () => {
    mostrarModalFormulario("Agregar Libro", {}, null);
  });

  async function eliminarLibro(event) {
    const index = event.target.dataset.index;
    const libro = libros[index];
    if (!libro) return;

    if (!confirm("¿Eliminar este libro?")) return;

    try {
      const res = await fetch(`/api/libros/${libro.isbn}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar libro');
      await cargarLibros();
    } catch (error) {
      alert(error.message);
    }
  }

  function editarLibro(event) {
    const index = event.target.dataset.index;
    const libro = libros[index];
    if (!libro) return;
    mostrarModalFormulario("Actualizar Libro", libro, index);
  }

  function mostrarModalFormulario(titulo, datosArg = {}, index = null) {
    const datos = datosArg || {};
    const fecha =
      datos.fecha_publicacion && !isNaN(Date.parse(datos.fecha_publicacion))
        ? new Date(datos.fecha_publicacion).toISOString().slice(0, 10)
        : "";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <h2>${titulo}</h2>
          <label>ISBN:</label>
          <input type="number" id="modal-isbn" value="${datos.isbn || ""}" ${index !== null ? "readonly" : ""}><br>
          <label>Título:</label>
          <input type="text" id="modal-titulo" value="${datos.titulo || ""}"><br>
          <label>Autor(es):</label>
          <select id="modal-autor" multiple></select><br>
          <label>Editorial:</label>
          <select id="modal-editorial"></select><br>
          <label>Categoría:</label>
          <input type="text" id="modal-categoria" value="${datos.categoria || ""}"><br>
          <label>Tipo:</label>
          <input type="text" id="modal-tipo" value="${datos.tipo || ""}"><br>
          <label>Precio:</label>
          <input type="number" id="modal-precio" value="${datos.precio || ""}" step="0.01"><br>
          <label>Fecha publicación:</label>
          <input type="date" id="modal-fecha" value="${fecha}"><br>
          <label>Cantidad en bodega:</label>
          <input type="number" id="modal-stock" value="${datos.cantidad_bodega || 0}"><br>
          <label>Best Seller:</label>
          <select id="modal-best-seller">
            <option value="true" ${datos.best_seller ? "selected" : ""}>Sí</option>
            <option value="false" ${!datos.best_seller ? "selected" : ""}>No</option>
          </select><br>
          <label>Estado:</label>
          <select id="modal-estado">
            <option value="Activo" ${datos.estado === "Activo" ? "selected" : ""}>Activo</option>
            <option value="Inactivo" ${datos.estado === "Inactivo" ? "selected" : ""}>Inactivo</option>
          </select><br>
          <button id="guardarBtn">Guardar</button>
          <button id="cancelarBtn">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    (async () => {
      const autores = await obtenerAutores();
      const editoriales = await obtenerEditoriales();

      const selectAutor = document.getElementById("modal-autor");
      const selectEditorial = document.getElementById("modal-editorial");

      autores.forEach(autor => {
        const option = document.createElement("option");
        option.value = autor.id;
        option.textContent = autor.nombre;
        if (datos.autor?.id === autor.id) option.selected = true;
        selectAutor.appendChild(option);
      });

      editoriales.forEach(editorial => {
        const option = document.createElement("option");
        option.value = editorial.id;
        option.textContent = editorial.nombre;
        if (datos.editorial?.id === editorial.id) option.selected = true;
        selectEditorial.appendChild(option);
      });
    })();

    document.getElementById("cancelarBtn").onclick = () => modal.remove();

    document.getElementById("guardarBtn").onclick = async () => {
      const fechaInput = document.getElementById("modal-fecha").value;
      const fechaValida = !isNaN(Date.parse(fechaInput)) ? new Date(fechaInput).toISOString() : null;

      const autorSelect = document.getElementById("modal-autor");
      const autorIds = Array.from(autorSelect.selectedOptions).map(opt => parseInt(opt.value));

      const libro = {
        isbn: parseInt(document.getElementById("modal-isbn").value.trim()),
        titulo: document.getElementById("modal-titulo").value.trim(),
        autorIds,
        editorialId: parseInt(document.getElementById("modal-editorial").value),
        categoria: document.getElementById("modal-categoria").value.trim(),
        tipo: document.getElementById("modal-tipo").value.trim(),
        precio: parseFloat(document.getElementById("modal-precio").value),
        fecha_publicacion: fechaValida,
        cantidad_bodega: parseInt(document.getElementById("modal-stock").value),
        estado: document.getElementById("modal-estado").value,
        best_seller: document.getElementById("modal-best-seller").value === "true"
      };

      console.log("Datos enviados:", libro);

      try {
        const res = await fetch(index === null ? '/api/libros' : `/api/libros/${libro.isbn}`, {
          method: index === null ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(libro)
        });

        if (!res.ok) throw new Error('Error al guardar libro');
        mostrarMensaje(index === null ? "📘 Libro agregado exitosamente." : "✏️ Libro actualizado correctamente.");
        await cargarLibros();
        modal.remove();
      } catch (error) {
        alert(error.message);
      }
    };
  }
  function mostrarMensaje(texto, tipo = "success") {
    const msg = document.getElementById("mensaje");
    msg.textContent = texto;
    msg.style.display = "block";
    msg.style.backgroundColor = tipo === "success" ? "#d4edda" : "#f8d7da";
    msg.style.color = tipo === "success" ? "#155724" : "#721c24";
    msg.style.border = `1px solid ${tipo === "success" ? "#c3e6cb" : "#f5c6cb"}`;

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }

  cargarLibros();
});


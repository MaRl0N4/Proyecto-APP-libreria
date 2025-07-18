document.addEventListener("DOMContentLoaded", () => {
  const btnConsultar = document.querySelector(".btn-consultar");
  const btnAgregar = document.querySelector(".btn-agregar");
  const tablaBody = document.querySelector("tbody");

  let editoriales = [];

  // Carga editoriales desde backend
  async function cargarEditoriales() {
    try {
      const res = await fetch('/api/editoriales');
      if (!res.ok) throw new Error('Error al cargar editoriales');
      editoriales = await res.json();
      renderTabla();
    } catch (error) {
      alert(error.message);
    }
  }

  // Renderiza la tabla con los datos actuales en editoriales
  function renderTabla(data = editoriales) {
    tablaBody.innerHTML = "";
    data.forEach((e, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.id}</td>
        <td>${e.ruc}</td>
        <td>${e.nombre}</td>
        <td>${e.email}</td>
        <td>${e.telefono}</td>
        <td>${e.sitio_web}</td>
        <td>${e.estado}</td>
        <td>
          <button class="btn-eliminar" data-index="${index}">
          <img src="IMG/eliminar.gif" alt="Eliminar" style="width:16px; vertical-align:middle; margin-right:5px;">
          </button>
        <button class="btn-editar" data-index="${index}">
          <img src="IMG/lapiz.gif" alt="Editar" style="width:16px; vertical-align:middle; margin-right:5px;">
        </button>
        </td>
      `;
      tablaBody.appendChild(row);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn =>
      btn.addEventListener("click", eliminarEditorial)
    );
    document.querySelectorAll(".btn-editar").forEach(btn =>
      btn.addEventListener("click", editarEditorial)
    );
  }

  // Buscar editorial por ID consultando backend
  btnConsultar.addEventListener("click", async () => {
    const valorBusqueda = document.getElementById("buscar").value.trim();
    if (!valorBusqueda) {
      cargarEditoriales();
      return;
    }

    try {
      const res = await fetch(`/api/editoriales/${valorBusqueda}`);
      if (!res.ok) {
        tablaBody.innerHTML = "<tr><td colspan='8'>No se encontró ninguna editorial con ese ID.</td></tr>";
        return;
      }
      const editorial = await res.json();
      renderTabla([editorial]);
    } catch (error) {
      alert(error.message);
    }
  });

  // Mostrar modal para agregar o editar
  btnAgregar.addEventListener("click", () => {
    mostrarModalFormulario("Agregar Editorial", null);
  });

  // Eliminar editorial
  async function eliminarEditorial(event) {
    const index = event.target.dataset.index;
    const id = editoriales[index].id;

    const confirmar = confirm("¿Estás seguro que deseas eliminar esta editorial?");
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/editoriales/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar editorial');

      await cargarEditoriales();
    } catch (error) {
      alert(error.message);
    }
  }

  // Editar editorial
  function editarEditorial(event) {
    const index = event.target.dataset.index;
    mostrarModalFormulario("Actualizar Editorial", { ...editoriales[index] }, index);
  }

  // Modal formulario para agregar/editar editorial
  function mostrarModalFormulario(titulo, datos = null, index = null) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
          <h2>${titulo}</h2>
          <label>RUC:</label>
          <input type="text" id="modal-ruc" required value="${datos?.ruc || ""}"><br>
          <label>Nombre:</label>
          <input type="text" id="modal-nombre" value="${datos?.nombre || ""}"><br>
          <label>Email:</label>
          <input type="email" id="modal-email" value="${datos?.email || ""}"><br>
          <label>Teléfono:</label>
          <input type="text" id="modal-telefono" value="${datos?.telefono || ""}"><br>
          <label>Sitio Web:</label>
          <input type="text" id="modal-sitio-web" value="${datos?.sitio_web || ""}"><br>
          <label>Estado:</label>
          <select id="modal-estado">
            <option value="Activo" ${datos?.estado === "Activo" ? "selected" : ""}>Activo</option>
            <option value="Inactivo" ${datos?.estado === "Inactivo" ? "selected" : ""}>Inactivo</option>
          </select><br>
          <button id="guardarBtn">Guardar</button>
          <button id="cancelarBtn">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("cancelarBtn").onclick = () => modal.remove();

    document.getElementById("guardarBtn").onclick = async () => {
      const ruc = document.getElementById("modal-ruc").value.trim();
      const nombre = document.getElementById("modal-nombre").value.trim();
      const email = document.getElementById("modal-email").value.trim();
      const telefono = document.getElementById("modal-telefono").value.trim();
      const sitioWeb = document.getElementById("modal-sitio-web").value.trim();
      const estado = document.getElementById("modal-estado").value;

      // Validaciones
      const rucValido = /^[0-9]{10}001$/.test(ruc);
      const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre);
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const telefonoValido = /^[0-9]{10}$/.test(telefono);
      const sitioWebValido = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/.test(sitioWeb);
      const estadoValido = estado === "Activo" || estado === "Inactivo";

      if (!rucValido) return alert("El RUC debe tener 13 dígitos y terminar en 001.");
      if (!nombreValido) return alert("El nombre debe tener al menos 2 letras y solo caracteres alfabéticos.");
      if (!emailValido) return alert("El email no tiene un formato válido.");
      if (!telefonoValido) return alert("El teléfono debe tener 10 dígitos numéricos.");
      if (!sitioWebValido) return alert("El sitio web debe tener un formato como: editorial.com");
      if (!estadoValido) return alert("Seleccione un estado válido.");

      const nuevaEditorial = {
        ruc,
        nombre,
        email,
        telefono,
        sitio_web: sitioWeb,
        estado,
      };

      try {
        let res;
        if (index === null) {
          // Crear nueva editorial
          res = await fetch('/api/editoriales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaEditorial)
          });
         mostrarMensaje("✅ Editorial creada exitosamente.", "success");
        } else {
          // Actualizar editorial
          const id = editoriales[index].id;
          res = await fetch(`/api/editoriales/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaEditorial)
          });
          mostrarMensaje("✏️ Editorial actualizada correctamente.", "success");
        }

        if (!res.ok) throw new Error('Error al guardar editorial');

        await cargarEditoriales();
        modal.remove();

      } catch (error) {
        alert(error.message);
      }
    };
  }

  // Carga inicial
  cargarEditoriales();

  function mostrarMensaje(texto, tipo = "success") {
  const msg = document.getElementById("mensaje");
  msg.textContent = texto;
  msg.style.display = "block";
  msg.style.backgroundColor = tipo === "success" ? "#d4edda" : "#f8d7da";
  msg.style.color = tipo === "success" ? "#155724" : "#721c24";
  msg.style.border = "1px solid " + (tipo === "success" ? "#c3e6cb" : "#f5c6cb");

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}




});

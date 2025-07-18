document.addEventListener("DOMContentLoaded", () => {
  const btnConsultar = document.querySelector(".btn-consultar");
  const btnAgregar = document.querySelector(".btn-agregar");
  const tablaBody = document.querySelector("tbody");

  let clientes = [];

  async function cargarClientes() {
    try {
      const res = await fetch('/api/clientes');
      if (!res.ok) throw new Error('Error al cargar clientes');
      clientes = await res.json();
      renderTabla();
    } catch (error) {
      alert(error.message);
    }
  }

  function renderTabla(data = clientes) {
    tablaBody.innerHTML = "";
    data.forEach((c, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.id}</td>
        <td>${c.nombres}</td>
        <td>${c.apellidos}</td>
        <td>${c.cedula}</td>
        <td>${c.telefono}</td>
        <td>${c.direccion}</td>
        <td>${c.estado}</td>
        <td>
          <button class="btn-eliminar" data-index="${index}">Eliminar</button>
          <button class="btn-editar" data-index="${index}">Editar</button>
        </td>
      `;
      tablaBody.appendChild(row);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn =>
      btn.addEventListener("click", eliminarCliente)
    );
    document.querySelectorAll(".btn-editar").forEach(btn =>
      btn.addEventListener("click", editarCliente)
    );
  }

  btnConsultar.addEventListener("click", async () => {
    const valorBusqueda = document.getElementById("buscar").value.trim();
    if (!valorBusqueda) {
      cargarClientes();
      return;
    }

    try {
      const res = await fetch(`/api/clientes/${valorBusqueda}`);
      if (!res.ok) {
        tablaBody.innerHTML = "<tr><td colspan='8'>No se encontró ningún cliente con ese ID.</td></tr>";
        return;
      }
      const cliente = await res.json();
      renderTabla([cliente]);
    } catch (error) {
      alert(error.message);
    }
  });

  btnAgregar.addEventListener("click", () => {
    mostrarModalFormulario("Agregar Cliente", null);
  });

  async function eliminarCliente(event) {
    const index = event.target.dataset.index;
    const id = clientes[index].id;

    const confirmar = confirm("¿Estás seguro que deseas eliminar este cliente?");
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar cliente');

      await cargarClientes();
    } catch (error) {
      alert(error.message);
    }
  }

  function editarCliente(event) {
    const index = event.target.dataset.index;
    mostrarModalFormulario("Actualizar Cliente", { ...clientes[index] }, index);
  }

  function mostrarModalFormulario(titulo, datos = null, index = null) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <h2>${titulo}</h2>
          <label>Nombres:</label>
          <input type="text" id="modal-nombres" value="${datos?.nombres || ""}"><br>
          <label>Apellidos:</label>
          <input type="text" id="modal-apellidos" value="${datos?.apellidos || ""}"><br>
          <label>Cédula:</label>
          <input type="text" id="modal-cedula" value="${datos?.cedula || ""}"><br>
          <label>Teléfono:</label>
          <input type="text" id="modal-telefono" value="${datos?.telefono || ""}"><br>
          <label>Dirección:</label>
          <input type="text" id="modal-direccion" value="${datos?.direccion || ""}"><br>
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

  function validarCedulaEcuatoriana(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.slice(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  const digitoVerificador = parseInt(cedula[9], 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let num = parseInt(cedula[i], 10);
    if (i % 2 === 0) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    suma += num;
  }

  const resultado = (10 - (suma % 10)) % 10;
  return resultado === digitoVerificador;
}





    document.getElementById("guardarBtn").onclick = async () => {
  const nombres = document.getElementById("modal-nombres").value.trim();
  const apellidos = document.getElementById("modal-apellidos").value.trim();
  const cedula = document.getElementById("modal-cedula").value.trim();
  const telefono = document.getElementById("modal-telefono").value.trim();
  const direccion = document.getElementById("modal-direccion").value.trim();
  const estado = document.getElementById("modal-estado").value;

  const nombresValidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombres);
  const apellidosValidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(apellidos);
  const cedulaValida = validarCedulaEcuatoriana(cedula);
  const telefonoValido = /^[0-9]{10}$/.test(telefono);
  const direccionValida = direccion.length >= 5;
  const estadoValido = estado === "Activo" || estado === "Inactivo";

  if (!nombresValidos) return alert("⚠️ Nombres inválidos. Mínimo 2 letras y sin caracteres especiales.");
  if (!apellidosValidos) return alert("⚠️ Apellidos inválidos. Mínimo 2 letras y sin caracteres especiales.");
  if (!cedulaValida) return alert("⚠️ Cédula inválida según el algoritmo ecuatoriano.");
  if (!telefonoValido) return alert("⚠️ El teléfono debe tener exactamente 10 dígitos.");
  if (!direccionValida) return alert("⚠️ La dirección debe tener al menos 5 caracteres.");
  if (!estadoValido) return alert("⚠️ Seleccione un estado válido.");

  const nuevoCliente = {
    nombres,
    apellidos,
    cedula,
    telefono,
    direccion,
    estado
  };

  try {
    let res;
    if (index === null) {
      res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });
      mostrarMensaje("✅ Cliente creado exitosamente.", "success");
    } else {
      const id = clientes[index].id;
      res = await fetch(`/api/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });
      mostrarMensaje("✏️ Cliente actualizado correctamente.", "success");
    }

    if (!res.ok) throw new Error("Error al guardar cliente");

    await cargarClientes();
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
    msg.style.border = "1px solid " + (tipo === "success" ? "#c3e6cb" : "#f5c6cb");

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }

  cargarClientes();
});

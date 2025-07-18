document.addEventListener("DOMContentLoaded", () => {
  // Simulación de datos del usuario
  const usuario = {
    nombreCompleto: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    telefono: "0994732330",
    contrasena: "123456",
    nombreUsuario: "jperez"
  };

  // Referencias a los elementos
  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const telefonoInput = document.getElementById("telefono");
  const contrasenaInput = document.getElementById("contrasena");
  const nombreUsuarioDisplay = document.querySelector(".nombre-usuario");
  const editarBtn = document.querySelector(".editar");
  const grabarBtn = document.querySelector(".grabar");

  // Función para cargar los datos
  function cargarDatos() {
    nombreInput.value = usuario.nombreCompleto;
    emailInput.value = usuario.email;
    telefonoInput.value = usuario.telefono;
    contrasenaInput.value = usuario.contrasena;
    nombreUsuarioDisplay.textContent = usuario.nombreUsuario;

    // Deshabilitar los campos
    [nombreInput, emailInput, telefonoInput ,contrasenaInput].forEach(input => {
      input.disabled = true;
    });
  }

  // Habilitar edición
  editarBtn.addEventListener("click", () => {
    [nombreInput, emailInput, telefonoInput ,contrasenaInput].forEach(input => {
      input.disabled = false;
    });
  });

  // Guardar cambios
  grabarBtn.addEventListener("click", () => {
    usuario.nombreCompleto = nombreInput.value;
    usuario.email = emailInput.value;
    usuario.telefono = telefonoInput.value;
    usuario.contrasena = contrasenaInput.value;

    // Deshabilitar campos nuevamente
    [nombreInput, emailInput,telefonoInput ,contrasenaInput].forEach(input => {
      input.disabled = true;
    });

    // Actualizar visualización del nombre de usuario si cambia el nombre completo
    nombreUsuarioDisplay.textContent = usuario.nombreUsuario;

    alert("Datos actualizados correctamente.");
  });

  // Cargar los datos al inicio
  cargarDatos();
});



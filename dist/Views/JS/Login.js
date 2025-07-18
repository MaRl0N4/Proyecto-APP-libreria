document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // FALTA LA  lógica de autenticación
  alert("Inicio de sesión con:\nEmail: " + email + "\nContraseña: " + password);
});

function recuperarContrasena() {
  alert("Redirigiendo a la recuperación de contraseña...");
   window.location.href = "recuperar.html";
}

function registrarse() {
  alert("Redirigiendo a la página de registro...");
   window.location.href = "registro.html";
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  btn.textContent = isPassword ? "🙈" : "👁️";
}



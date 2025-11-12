document.getElementById("studentForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("studentEmail").value.trim();
  const password = document.getElementById("studentPassword").value.trim();
  const error = document.getElementById("error");

  // Obtener los estudiantes registrados por el administrador
  const students = JSON.parse(localStorage.getItem("students")) || [];

  // Buscar coincidencia
  const student = students.find(s => s.email === email && s.password === password);

  if (student) {
    error.style.color = "green";
    error.textContent = "Acceso concedido. Redirigiendo...";

    // 🔹 Guardar en localStorage para que el home lo reconozca
    localStorage.setItem("studentLogged", JSON.stringify({ email }));

    setTimeout(() => {
      window.location.href = "homeestudiante.html";
    }, 1200);
  } else {
    error.style.color = "red";
    error.textContent = "Correo o contraseña incorrectos.";
  }
});

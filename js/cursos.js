// Verificar si el estudiante está logueado
const loggedUser = JSON.parse(localStorage.getItem("studentLogged"));
if (!loggedUser || !loggedUser.email) {
  window.location.href = "login.html";
}

// Botón para volver al home
document.getElementById("back-home").addEventListener("click", () => {
  window.location.href = "homeestudiante.html";
});

// Obtener los cursos guardados por el administrador
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const container = document.getElementById("courses-container");

if (courses.length === 0) {
  container.innerHTML = `<p class="no-courses">No hay cursos disponibles en este momento.</p>`;
} else {
  courses.forEach(course => {
    const card = document.createElement("div");
    card.classList.add("course-card");
    card.innerHTML = `
      <h2>${course.name}</h2>
      <p>${course.description}</p>
      ${
        course.modules && course.modules.length > 0
          ? `<ul class="modules-list">${course.modules.map(m => `<li>${m}</li>`).join("")}</ul>`
          : "<p>No hay módulos registrados aún.</p>"
      }
    `;
    container.appendChild(card);
  });
}

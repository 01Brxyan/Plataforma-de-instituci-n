// Verificar si el estudiante está logueado correctamente
const loggedUser = JSON.parse(localStorage.getItem("studentLogged"));

if (!loggedUser || !loggedUser.email) {
  // Si no hay usuario logueado, vuelve al login de estudiante
  window.location.href = "login.html";
} else {
  // Mostrar el saludo con el correo
  document.getElementById("student-email").textContent = `Hola, ${loggedUser.email}`;
}

// Cambiar y guardar foto de perfil
const profileImg = document.getElementById("profile-img");
const uploadImg = document.getElementById("upload-img");

// Cargar la foto guardada (si existe)
const savedImg = localStorage.getItem(`profile-${loggedUser.email}`);
if (savedImg) {
  profileImg.src = savedImg;
}

// Cuando el estudiante sube una nueva foto
uploadImg.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    profileImg.src = event.target.result;
    localStorage.setItem(`profile-${loggedUser.email}`, event.target.result);
  };
  reader.readAsDataURL(file);
});

// Redirecciones dentro del home
document.getElementById("go-cursos").addEventListener("click", () => {
  window.location.href = "cursos.html";
});

document.getElementById("go-profesores").addEventListener("click", () => {
  window.location.href = "profesores.html";
});

document.getElementById("go-administrativos").addEventListener("click", () => {
  window.location.href = "administrativos.html";
});

// Cerrar sesión del estudiante
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("studentLogged");
  window.location.href = "login.html";
});

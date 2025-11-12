// === AGREGAR ESTUDIANTE ===
document.getElementById("addStudentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("studentEmail").value.trim();
  const password = document.getElementById("studentPassword").value.trim();
  const msg = document.getElementById("studentMsg");

  let students = JSON.parse(localStorage.getItem("students")) || [];

  const exists = students.some(s => s.email === email);
  if (exists) {
    msg.style.color = "red";
    msg.textContent = "Este estudiante ya existe.";
    return;
  }

  students.push({ email, password });
  localStorage.setItem("students", JSON.stringify(students));

  msg.style.color = "green";
  msg.textContent = "Estudiante agregado correctamente.";
  e.target.reset();
});

// === AGREGAR CURSO ===
document.getElementById("addCourseForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("courseName").value.trim();
  const desc = document.getElementById("courseDesc").value.trim();
  const msg = document.getElementById("courseMsg");

  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  courses.push({ name, desc });
  localStorage.setItem("courses", JSON.stringify(courses));

  msg.style.color = "green";
  msg.textContent = "Curso agregado correctamente.";
  e.target.reset();
});

// === AGREGAR MÓDULO Y LECCIÓN ===
document.getElementById("addModuleForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const moduleName = document.getElementById("moduleName").value.trim();
  const lessonName = document.getElementById("lessonName").value.trim();
  const msg = document.getElementById("moduleMsg");

  let modules = JSON.parse(localStorage.getItem("modules")) || [];
  modules.push({ moduleName, lessonName });
  localStorage.setItem("modules", JSON.stringify(modules));

  msg.style.color = "green";
  msg.textContent = "Módulo y lección agregados correctamente.";
  e.target.reset();
});


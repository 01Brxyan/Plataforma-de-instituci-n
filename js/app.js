const app = document.getElementById("app");

let state = {
  view: "home"
};

function render() {
  if (state.view === "home") {
    renderHome();
  } else if (state.view === "login") {
    renderLogin();
  } else if (state.view === "admin") {
    renderDashboard();
  }
}

function renderHome() {
  app.innerHTML = `
    <h1>Bienvenido a la Plataforma ABC</h1>
    <p>Plataforma educativa para cursos, módulos y lecciones.</p>
    <button id="loginBtn">Iniciar sesión (Administrativo)</button>
  `;

  document.getElementById("loginBtn").addEventListener("click", () => {
    state.view = "login";
    render();
  });
}

function renderLogin() {
  app.innerHTML = `
    <h2>Inicio de sesión</h2>
    <form id="loginForm">
      <label>Email: <input type="email" id="email" required></label><br>
      <label>Contraseña: <input type="password" id="pass" required></label><br>
      <button type="submit">Entrar</button>
      <button type="button" id="backBtn">Volver</button>
    </form>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    state.view = "home";
    render();
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;

    if (email === "admin@abc.edu" && pass === "1234") {
      localStorage.setItem("session", JSON.stringify({ email }));
      state.view = "admin";
      render();
    } else {
      alert("Credenciales inválidas");
    }
  });
}

function renderDashboard() {
  const user = JSON.parse(localStorage.getItem("session"));
  app.innerHTML = `
    <h2>Panel Administrativo</h2>
    <p>Bienvenido, ${user.email}</p>
    <button id="logoutBtn">Cerrar Sesión</button>
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("session");
    state.view = "home";
    render();
  });
}

render();


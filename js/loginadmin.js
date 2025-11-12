document.getElementById("adminForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que se recargue la página

  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();
  const error = document.getElementById("error");

  
  const adminUser = "a@gmail.com";
  const adminPass = "a";

  
  if (user === adminUser && pass === adminPass) {
    error.style.color = "green";
    error.textContent = "Acceso concedido. Redirigiendo...";

    
    sessionStorage.setItem("adminLogged", "true");

    
    setTimeout(() => {
      window.location.href = "homeadmin.html";
    }, 1200); 
  } else {
    error.style.color = "red";
    error.textContent = "Usuario o contraseña incorrectos.";
  }
});

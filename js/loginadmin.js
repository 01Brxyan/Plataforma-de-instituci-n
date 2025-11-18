document.getElementById('form-admin').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email-admin').value.trim();
    const pass = document.getElementById('pass-admin').value;

    // CREDENCIALES
    const adminValido = {
        email: "a@gmail.com",
        password: "a"
    };

    if (email === adminValido.email && pass === adminValido.password) {
        // Guardar sesión de administrador
        const adminData = {
            nombre: "Administrador",
            email: email,
            rol: "admin"
        };
        localStorage.setItem('adminLogueado', JSON.stringify(adminData));

        alert('Bienvenido, Administrador');
        window.location.href = 'homeadmin.html';
    } else {
        alert('Credenciales incorrectas');
    }
});
// js/administradores.js → Muestra los administradores creados en el panel de admin
document.addEventListener('DOMContentLoaded', () => {
    // Usamos la misma clave que el panel de administrador: 'eduPlatform_administradores'
    const administradores = JSON.parse(localStorage.getItem('eduPlatform_administradores')) || [];
    const lista = document.getElementById('lista-administradores');

    if (administradores.length === 0) {
        lista.innerHTML = '<p class="no-data">No hay administradores registrados aún.</p>';
        return;
    }

    lista.innerHTML = administradores.map(admin => `
        <div class="admin-card">
            <img src="${admin.foto || '../assets/images/default-admin.png'}" alt="${admin.nombre}">
            <div class="info">
                <h3>${admin.nombre}</h3>
                <p>${admin.email}</p>
                <small><i class="fas fa-shield-alt"></i> Administrador del sistema</small>
            </div>
        </div>
    `).join('');
});

// Reutilizamos la misma función de cerrar sesión
function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('estudianteLogueado');
        localStorage.removeItem('adminLogueado'); // por si acaso
        window.location.href = 'login.html';
    }
}
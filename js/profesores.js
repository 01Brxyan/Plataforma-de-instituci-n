// js/profesores.js → 100% LIMPIO, ENTRA DIRECTO, NUNCA PIDE NADA
document.addEventListener('DOMContentLoaded', () => {
    const profesores = JSON.parse(localStorage.getItem('eduPlatform_profesores')) || [];
    const lista = document.getElementById('lista-profesores');

    if (profesores.length === 0) {
        lista.innerHTML = '<p class="no-data">No hay profesores registrados aún.</p>';
        return;
    }

    lista.innerHTML = profesores.map(p => `
        <div class="profesor-card">
            <img src="${p.foto || '../assets/images/default-profesor.png'}" alt="${p.nombre}">
            <div class="info">
                <h3>${p.nombre} ${p.apellido || ''}</h3>
                <p>${p.email || 'Sin correo'}</p>
                <small>Cursos que dicta: ${p.cursos?.map(c => c.nombre).join(', ') || 'Ninguno'}</small>
            </div>
        </div>
    `).join('');
});

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('estudianteLogueado');
        window.location.href = 'login.html';
    }
}
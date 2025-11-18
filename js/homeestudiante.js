document.addEventListener('DOMContentLoaded', () => {
    const estudiante = JSON.parse(localStorage.getItem('estudianteLogueado'));

    if (!estudiante) {
        window.location.href = 'login.html'; 
        return;
    }

    // Carga el nombre y foto del estudiante
    document.getElementById('nombre-estudiante').textContent = 
        `${estudiante.nombre} ${estudiante.apellido || ''}`;

    if (estudiante.foto) {
        document.getElementById('foto-perfil').src = estudiante.foto;
    }

    // Estadísticas de ejemplo
    document.getElementById('total-cursos').textContent = '12';
    document.getElementById('horas-estudio').textContent = '89';
    document.getElementById('progreso').textContent = '76%';
});

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('estudianteLogueado');
        window.location.href = 'login.html';
    }
}
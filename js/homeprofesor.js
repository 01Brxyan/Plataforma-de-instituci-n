document.addEventListener('DOMContentLoaded', () => {
    const profesor = JSON.parse(localStorage.getItem('profesorLogueado'));

    if (!profesor) {
        alert('Acceso denegado. Inicia sesión como profesor.');
        window.location.href = 'login.html';
        return;
    }

    // Nombre y foto
    document.getElementById('nombre-profesor').textContent = profesor.nombre;
    const foto = profesor.foto || '../assets/images/default-profesor.png';
    document.getElementById('foto-profesor').src = foto;

    // Estadísticas
    const cursos = JSON.parse(localStorage.getItem('eduPlatform_cursos') || '[]');
    const misCursos = cursos.filter(c => profesor.cursos?.includes(c.id));
    document.getElementById('total-cursos').textContent = misCursos.length;

    // Aquí puedes contar estudiantes inscritos en tus cursos (ejemplo)
    document.getElementById('total-estudiantes').textContent = '248';

    // Cursos recientes
    const contenedor = document.getElementById('cursos-recientes');
    if (misCursos.length === 0) {
        contenedor.innerHTML = '<p class="no-data">No tienes cursos asignados aún.</p>';
    } else {
        contenedor.innerHTML = misCursos.map(curso => `
            <div class="curso-card" onclick="location.href='reporte.html?id=${curso.id}'">
                <div class="curso-img"><i class="fas fa-graduation-cap"></i></div>
                <div class="curso-info">
                    <h3>${curso.nombre}</h3>
                    <p>${curso.modulos?.length || 0} módulos • ${curso.estudiantes?.length || 0} estudiantes</p>
                </div>
            </div>
        `).join('');
    }
});

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('profesorLogueado');
        window.location.href = 'login.html';
    }
}
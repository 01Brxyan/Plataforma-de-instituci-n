document.addEventListener('DOMContentLoaded', () => {
    // Verifica que el estudiante esté logueado (opcional, puedes quitar si quieres público)
    const estudiante = JSON.parse(localStorage.getItem('estudianteLogueado'));
    if (!estudiante) {
        window.location.href = 'login.html';
        return;
    }

    const cursos = JSON.parse(localStorage.getItem('eduPlatform_cursos')) || [];
    const lista = document.getElementById('lista-cursos');
    document.getElementById('total-cursos').textContent = `${cursos.length} curso${cursos.length !== 1 ? 's' : ''} disponible${cursos.length !== 1 ? 's' : ''}`;

    if (cursos.length === 0) {
        lista.innerHTML = '<p class="no-data">El administrador aún no ha agregado cursos.</p>';
        return;
    }

    lista.innerHTML = cursos.map((curso, index) => `
        <div class="curso-card" onclick="abrirCurso(${index})">
            <div class="curso-img">
                ${curso.foto ? `<img src="${curso.foto}" alt="${curso.nombre}">` : '<i class="fas fa-laptop-code"></i>'}
            </div>
            <div class="curso-info">
                <h3>${curso.nombre}</h3>
                <p>${curso.descripcion || 'Sin descripción'}</p>
                <div class="curso-stats">
                    <span><i class="fas fa-folder"></i> ${curso.modulos ? curso.modulos.length : 0} módulos</span>
                    <span><i class="fas fa-play-circle"></i> ${curso.modulos ? curso.modulos.reduce((t, m) => t + (m.lecciones?.length || 0), 0) : 0} lecciones</span>
                </div>
                <div class="progreso">
                    <div class="progreso-bar">
                        <div class="progreso-fill" style="width: ${curso.progreso || 0}%"></div>
                    </div>
                    <small>${curso.progreso || 0}% completado</small>
                </div>
            </div>
        </div>
    `).join('');
});

// Abre el detalle del curso seleccionado
function abrirCurso(index) {
    localStorage.setItem('cursoActivo', index);
    window.location.href = 'cursos.html';
}

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('estudianteLogueado');
        window.location.href = 'login.html';
    }
}

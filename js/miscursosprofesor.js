document.addEventListener('DOMContentLoaded', () => {
    const profesor = JSON.parse(localStorage.getItem('profesorLogueado'));
    if (!profesor) {
        alert('Acceso denegado. Inicia sesión como profesor.');
        window.location.href = 'login.html';
        return;
    }

    // Foto del profesor
    const foto = profesor.foto || '../assets/images/default-profesor.png';
    document.getElementById('foto-profesor').src = foto;

    const cursosTotales = JSON.parse(localStorage.getItem('ABCPlatform_cursos') || '[]');
    const misCursos = cursosTotales.filter(c => 
        profesor.cursos && profesor.cursos.includes(c.id)
    );

    const contenedor = document.getElementById('lista-cursos');
    const buscador = document.getElementById('buscador');
    const filtroEstado = document.getElementById('filtro-estado');

    function renderizarCursos(cursosFiltrados) {
        if (cursosFiltrados.length === 0) {
            contenedor.innerHTML = '<p class="no-data">No tienes cursos asignados o no coinciden con el filtro.</p>';
            return;
        }

        contenedor.innerHTML = cursosFiltrados.map(curso => `
            <div class="curso-card" onclick="verCurso('${curso.id}')">
                <div class="curso-img">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="curso-info">
                    <h3>${curso.nombre}</h3>
                    <p>${curso.descripcion || 'Sin descripción'}</p>
                    <div class="curso-stats">
                        <span><i class="fas fa-users"></i> ${curso.estudiantes?.length || 0} estudiantes</span>
                        <span><i class="fas fa-book"></i> ${curso.modulos?.length || 0} módulos</span>
                    </div>
                    <div class="curso-estado">${curso.estado || 'Activo'}</div>
                </div>
            </div>
        `).join('');
    }

    // Filtros
    function filtrar() {
        let filtrados = [...misCursos];
        const texto = buscador.value.toLowerCase();
        const estado = filtroEstado.value;

        if (texto) {
            filtrados = filtrados.filter(c => 
                c.nombre.toLowerCase().includes(texto) || 
                (c.descripcion && c.descripcion.toLowerCase().includes(texto))
            );
        }

        if (estado !== 'todos') {
            filtrados = filtrados.filter(c => 
                (c.estado || 'Activo').toLowerCase() === estado
            );
        }

        renderizarCursos(filtrados);
    }

    buscador.addEventListener('input', filtrar);
    filtroEstado.addEventListener('change', filtrar);

    renderizarCursos(misCursos);
});

function verCurso(id) {
    window.location.href = `html/reporte.html?id=${id}`;
}

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('profesorLogueado');
        window.location.href = 'login.html';
    }
}
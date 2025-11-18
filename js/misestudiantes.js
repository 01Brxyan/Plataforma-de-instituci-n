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

    const cursos = JSON.parse(localStorage.getItem('eduPlatform_cursos') || '[]');
    const estudiantesTotales = JSON.parse(localStorage.getItem('eduPlatform_estudiantes') || '[]');

    // Obtener IDs de cursos del profesor
    const misCursosIds = profesor.cursos || [];

    // Estudiantes únicos en mis cursos
    const estudiantesEnMisCursos = new Set();
    const estudiantesConDatos = [];

    misCursosIds.forEach(cursoId => {
        const curso = cursos.find(c => c.id === cursoId);
        if (curso && curso.estudiantes) {
            curso.estudiantes.forEach(idEst => {
                if (!estudiantesEnMisCursos.has(idEst)) {
                    estudiantesEnMisCursos.add(idEst);
                    const estudiante = estudiantesTotales.find(e => e.id === idEst);
                    if (estudiante) {
                        estudiantesConDatos.push({
                            ...estudiante,
                            cursos: [curso.nombre]
                        });
                    }
                } else {
                    // Si ya existe, agregar el curso adicional
                    const existente = estudiantesConDatos.find(e => e.id === idEst);
                    if (existente) existente.cursos.push(curso.nombre);
                }
            });
        }
    });

    // Llenar filtro de cursos
    const filtroCurso = document.getElementById('filtro-curso');
    misCursosIds.forEach(id => {
        const curso = cursos.find(c => c.id === id);
        if (curso) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = curso.nombre;
            filtroCurso.appendChild(option);
        }
    });

    // Estadísticas
    document.getElementById('total-estudiantes').textContent = estudiantesConDatos.length;
    document.getElementById('activos-hoy').textContent = Math.floor(estudiantesConDatos.length * 0.68);
    const promedio = estudiantesConDatos.reduce((acc, e) => acc + (e.progreso || 0), 0) / estudiantesConDatos.length || 0;
    document.getElementById('promedio-general').textContent = Math.round(promedio) + '%';

    const contenedor = document.getElementById('lista-estudiantes');
    const buscador = document.getElementById('buscador');

    function renderizar(estudiantes) {
        if (estudiantes.length === 0) {
            contenedor.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <p>No tienes estudiantes inscritos o no coinciden con el filtro.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = estudiantes.map(est => `
            <div class="estudiante-card" onclick="verPerfil('${est.id}')">
                <img src="${est.foto || '../assets/images/default-estudiante.png'}" 
                     alt="${est.nombre}" class="estudiante-avatar">
                <div class="estudiante-info">
                    <h3>${est.nombre} ${est.apellido || ''}</h3>
                    <p><i class="fas fa-envelope"></i> ${est.email}</p>
                    <p><i class="fas fa-calendar"></i> Inscrito desde ${est.fechaInscripcion || '2025'}</p>
                    <div class="cursos-list">
                        <i class="fas fa-book"></i> ${est.cursos.join(', ')}
                    </div>
                    <div class="progreso">
                        <div class="progreso-fill" style="width: ${est.progreso || 0}%"></div>
                    </div>
                    <small>${est.progreso || 0}% completado</small>
                </div>
            </div>
        `).join('');
    }

    function filtrar() {
        let filtrados = [...estudiantesConDatos];
        const texto = buscador.value.toLowerCase();
        const cursoId = filtroCurso.value;

        if (texto) {
            filtrados = filtrados.filter(e => 
                e.nombre.toLowerCase().includes(texto) ||
                e.apellido?.toLowerCase().includes(texto) ||
                e.email.toLowerCase().includes(texto)
            );
        }

        if (cursoId) {
            const curso = cursos.find(c => c.id === cursoId);
            if (curso && curso.estudiantes) {
                filtrados = filtrados.filter(e => curso.estudiantes.includes(e.id));
            }
        }

        renderizar(filtrados);
    }

    buscador.addEventListener('input', filtrar);
    filtroCurso.addEventListener('change', filtrar);

    renderizar(estudiantesConDatos);
});

function verPerfil(id) {
    window.location.href = `perfil-estudiante.html?id=${id}`;
}

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('profesorLogueado');
        window.location.href = 'login.html';
    }
}
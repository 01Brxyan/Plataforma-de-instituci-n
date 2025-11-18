document.addEventListener('DOMContentLoaded', () => {
    const profesor = JSON.parse(localStorage.getItem('profesorLogueado'));
    if (!profesor) {
        alert('Acceso denegado. Inicia sesión como profesor.');
        window.location.href = 'login.html';
        return;
    }

    const foto = profesor.foto || '../assets/images/default-profesor.png';
    document.getElementById('foto-profesor').src = foto;

    const cursos = JSON.parse(localStorage.getItem('eduPlatform_cursos') || '[]');
    const estudiantes = JSON.parse(localStorage.getItem('eduPlatform_estudiantes') || '[]');
    const selectCurso = document.getElementById('select-curso');
    const selectTarea = document.getElementById('select-tarea');
    const tablaBody = document.querySelector('#tabla-calificaciones tbody');
    const sinDatos = document.getElementById('sin-datos');

    // Llenar select de cursos
    const misCursos = cursos.filter(c => profesor.cursos?.includes(c.id));
    misCursos.forEach(curso => {
        const opt = document.createElement('option');
        opt.value = curso.id;
        opt.textContent = curso.nombre;
        selectCurso.appendChild(opt);
    });

    selectCurso.addEventListener('change', () => {
        const cursoId = selectCurso.value;
        selectTarea.innerHTML = '<option value="">Todas las actividades</option>';
        
        if (!cursoId) {
            tablaBody.innerHTML = '';
            sinDatos.style.display = 'block';
            return;
        }

        const curso = misCursos.find(c => c.id === cursoId);
        if (curso.tareas) {
            curso.tareas.forEach(tarea => {
                const opt = document.createElement('option');
                opt.value = tarea.id;
                opt.textContent = tarea.nombre;
                selectTarea.appendChild(opt);
            });
        }

        cargarCalificaciones(cursoId);
    });

    selectTarea.addEventListener('change', () => {
        cargarCalificaciones(selectCurso.value);
    });

    function cargarCalificaciones(cursoId) {
        const curso = misCursos.find(c => c.id === cursoId);
        if (!curso || !curso.estudiantes) {
            tablaBody.innerHTML = '';
            sinDatos.style.display = 'block';
            return;
        }

        sinDatos.style.display = 'none';
        let filas = [];

        curso.estudiantes.forEach(estId => {
            const estudiante = estudiantes.find(e => e.id === estId);
            if (!estudiante) return;

            const calificaciones = estudiante.calificaciones?.[cursoId] || {};
            const tareas = curso.tareas || [];

            if (tareas.length === 0) {
                filas.push(generarFila(estudiante, curso, null));
            } else {
                tareas.forEach(tarea => {
                    if (!selectTarea.value || selectTarea.value === tarea.id) {
                        const calif = calificaciones[tarea.id];
                        filas.push(generarFila(estudiante, curso, tarea, calif));
                    }
                });
            }
        });

        tablaBody.innerHTML = filas.join('');
    }

    function generarFila(estudiante, curso, tarea, calificacion = null) {
        const nota = calificacion?.nota || '-';
        const fecha = calificacion?.fecha || '-';
        const estado = calificacion ? 
            (calificacion.nota >= 70 ? 'entregado' : 'reprobado') : 
            'pendiente';

        const claseNota = nota === '-' ? 'pendiente' : 
                         (nota >= 70 ? 'aprobado' : 'reprobado');

        return `
            <tr>
                <td>${estudiante.nombre} ${estudiante.apellido || ''}</td>
                <td>${estudiante.email}</td>
                <td>${curso.nombre}</td>
                <td>${tarea ? tarea.nombre : 'Sin tareas asignadas'}</td>
                <td><span class="nota ${claseNota}">${nota}</span></td>
                <td>${fecha}</td>
                <td><span class="estado ${estado}">${estado === 'pendiente' ? 'Pendiente' : estado === 'entregado' ? 'Entregado' : 'Reprobado'}</span></td>
                <td>
                    ${tarea ? `<button class="btn-editar" onclick="editarNota('${estudiante.id}','${curso.id}','${tarea.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>` : '-'}
                </td>
            </tr>
        `;
    }

    document.getElementById('btn-exportar').addEventListener('click', () => {
        alert('Función de exportar a Excel en desarrollo');
    });
});

function editarNota(estudianteId, cursoId, tareaId) {
    const nuevaNota = prompt('Ingresa la nueva nota (0-100):');
    if (nuevaNota === null) return;

    const nota = parseInt(nuevaNota);
    if (isNaN(nota) || nota < 0 || nota > 100) {
        alert('Nota inválida. Debe estar entre 0 y 100.');
        return;
    }

    const estudiantes = JSON.parse(localStorage.getItem('eduPlatform_estudiantes') || '[]');
    const estudiante = estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return;

    if (!estudiante.calificaciones) estudiante.calificaciones = {};
    if (!estudiante.calificaciones[cursoId]) estudiante.calificaciones[cursoId] = {};

    estudiante.calificaciones[cursoId][tareaId] = {
        nota: nota,
        fecha: new Date().toLocaleDateString('es-CO')
    };

    localStorage.setItem('eduPlatform_estudiantes', JSON.stringify(estudiantes));
    alert(`Nota actualizada: ${nota}/100`);
    
    // Recargar la tabla
    const selectCurso = document.getElementById('select-curso');
    if (selectCurso.value) {
        cargarCalificaciones(selectCurso.value);
    }
}

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('profesorLogueado');
        window.location.href = 'login.html';
    }
}
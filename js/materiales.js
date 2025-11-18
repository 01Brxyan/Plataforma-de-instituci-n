document.addEventListener('DOMContentLoaded', () => {
    const profesor = JSON.parse(localStorage.getItem('profesorLogueado'));
    if (!profesor) {
        alert('Acceso denegado. Inicia sesión como profesor.');
        window.location.href = 'login.html';
        return;
    }

    const foto = profesor.foto || '../assets/images/default-profesor.png';
    document.getElementById('foto-profesor').src = foto;

    const inputFile = document.getElementById('input-file');
    const selectCurso = document.getElementById('select-curso');
    const grid = document.getElementById('materiales-grid');
    const sinMateriales = document.getElementById('sin-materiales');

    // Cargar cursos del profesor
    const cursos = JSON.parse(localStorage.getItem('eduPlatform_cursos') || '[]');
    const misCursos = cursos.filter(c => profesor.cursos?.includes(c.id));

    misCursos.forEach(curso => {
        const opt = document.createElement('option');
        opt.value = curso.id;
        opt.textContent = curso.nombre;
        selectCurso.appendChild(opt);
    });

    // Cargar materiales existentes
    let materiales = JSON.parse(localStorage.getItem('eduPlatform_materiales') || '[]');

    function renderizar() {
        const cursoId = selectCurso.value;
        const filtrados = cursoId ? materiales.filter(m => m.cursoId === cursoId) : materiales;

        if (filtrados.length === 0) {
            grid.innerHTML = '';
            sinMateriales.style.display = 'block';
            return;
        }

        sinMateriales.style.display = 'none';
        grid.innerHTML = filtrados.map((mat, index) => {
            const icono = getIcono(mat.tipo);
            const preview = mat.tipo.startsWith('image/') ? `<img src="${mat.data}" alt="${mat.nombre}">` :
                           mat.tipo === 'video/mp4' ? `<video src="${mat.data}" controls></video>` :
                           `<i class="fas ${icono}"></i>`;

            return `
                <div class="material-card">
                    <div class="material-preview">${preview}</div>
                    <div class="material-info">
                        <h3>${mat.nombre}</h3>
                        <p><i class="fas fa-book"></i> ${getCursoNombre(mat.cursoId)}</p>
                        <p><i class="fas fa-calendar"></i> ${mat.fecha}</p>
                        <div class="material-meta">
                            <span>${mat.tamaño}</span>
                            <div class="material-actions">
                                <button class="btn-descargar" onclick="descargarMaterial('${mat.data}', '${mat.nombre}')">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarMaterial(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function getIcono(tipo) {
        if (tipo.includes('pdf')) return 'fa-file-pdf';
        if (tipo.includes('word')) return 'fa-file-word';
        if (tipo.includes('powerpoint')) return 'fa-file-powerpoint';
        if (tipo.includes('image')) return 'fa-image';
        if (tipo.includes('video')) return 'fa-video';
        if (tipo.includes('zip')) return 'fa-file-archive';
        return 'fa-file';
    }

    function getCursoNombre(id) {
        const curso = cursos.find(c => c.id === id);
        return curso ? curso.nombre : 'Curso eliminado';
    }

    // Subir archivos
    inputFile.addEventListener('change', () => {
        if (!selectCurso.value) {
            alert('Selecciona un curso primero');
            return;
        }

        Array.from(inputFile.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const material = {
                    id: Date.now() + Math.random(),
                    nombre: file.name,
                    tipo: file.type,
                    tamaño: formatBytes(file.size),
                    data: e.target.result,
                    cursoId: selectCurso.value,
                    fecha: new Date().toLocaleDateString('es-CO'),
                    profesorId: profesor.id
                };
                materiales.push(material);
                localStorage.setItem('eduPlatform_materiales', JSON.stringify(materiales));
                renderizar();
            };
            reader.readAsDataURL(file);
        });
        inputFile.value = '';
    });

    selectCurso.addEventListener('change', renderizar);

    // Funciones auxiliares
    window.descargarMaterial = (dataUrl, nombre) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = nombre;
        a.click();
    };

    window.eliminarMaterial = (index) => {
        if (confirm('¿Eliminar este material permanentemente?')) {
            materiales.splice(index, 1);
            localStorage.setItem('eduPlatform_materiales', JSON.stringify(materiales));
            renderizar();
        }
    };

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' Bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    renderizar();
});

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('profesorLogueado');
        window.location.href = 'login.html';
    }
}
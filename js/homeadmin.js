const STORAGE_KEY = 'eduPlatform';
const DB = {
  get(key) { return JSON.parse(localStorage.getItem(`${STORAGE_KEY}_${key}`)) || []; },
  set(key, data) { localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data)); }
};

// INICIO: CARGAR TODO 
document.addEventListener('DOMContentLoaded', () => {
  renderEstudiantes();
  renderProfesores();
  renderCursos();
  renderModulos();
  renderAdministradores();        // ← NUEVO
  cargarCursosEnSelects();

  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
  });
});

// ESTUDIANTES
function renderEstudiantes() {
  const estudiantes = DB.get('estudiantes');
  const list = document.getElementById('estudiantes-list');
  if (!list) return;

  list.innerHTML = estudiantes.length === 0
    ? '<p class="no-data">No hay estudiantes registrados</p>'
    : estudiantes.map(e => `
      <div class="item-card">
        <div>
          <h4>${e.nombre} ${e.apellido || ''}</h4>
          <p>${e.email}</p>
        </div>
        <div>
          <button onclick="editarEstudiante(${e.id})" class="btn-editar">Editar</button>
          <button onclick="eliminarEstudiante(${e.id})" class="btn-eliminar">Eliminar</button>
        </div>
      </div>
    `).join('');
}

window.editarEstudiante = (id) => abrirModal('estudiante', id);
window.eliminarEstudiante = (id) => {
  if (confirm('¿Eliminar estudiante?')) {
    DB.set('estudiantes', DB.get('estudiantes').filter(e => e.id !== id));
    renderEstudiantes();
  }
};

document.getElementById('form-estudiante')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('estudiante-id').value;
  const datos = {
    nombre: document.getElementById('nombre-estudiante').value.trim(),
    apellido: document.getElementById('apellido-estudiante').value.trim(),
    email: document.getElementById('email-estudiante').value.trim(),
  };

  const lista = DB.get('estudiantes');
  if (id) {
    const index = lista.findIndex(x => x.id === parseInt(id));
    lista[index] = { ...lista[index], ...datos };
  } else {
    datos.id = Date.now();
    lista.push(datos);
  }
  DB.set('estudiantes', lista);
  renderEstudiantes();
  cerrarModal();
});

// PROFESORES
function renderProfesores() {
  const profesores = DB.get('profesores');
  const cursos = DB.get('cursos');
  const list = document.getElementById('profesores-list');
  if (!list) return;

  list.innerHTML = profesores.length === 0
    ? '<p class="no-data">No hay profesores registrados</p>'
    : profesores.map(p => {
      const cursosTxt = p.cursos.map(id => cursos.find(c => c.id === id)?.nombre || '').filter(Boolean).join(', ') || 'Sin cursos';
      const puedeBorrar = p.cursos.length === 0;

      return `
        <div class="item-card">
          <img src="${p.foto || 'assets/default-avatar.png'}" class="avatar" alt="profesor">
          <div>
            <h4>${p.nombre}</h4>
            <p>${p.email || 'Sin email'}</p>
            <small>${cursosTxt}</small>
          </div>
          <div>
            <button onclick="editarProfesor(${p.id})" class="btn-editar">Editar</button>
            <button onclick="eliminarProfesor(${p.id})" class="btn-eliminar" ${puedeBorrar ? '' : 'disabled'}>
              Eliminar
            </button>
          </div>
        </div>
      `;
    }).join('');
}

window.editarProfesor = (id) => abrirModal('profesor', id);
window.eliminarProfesor = (id) => {
  const prof = DB.get('profesores').find(p => p.id === id);
  if (prof.cursos37.length > 0) return alert('No se puede eliminar: tiene cursos asignados');
  if (confirm('¿Eliminar profesor?')) {
    DB.set('profesores', DB.get('profesores').filter(p => p.id !== id));
    renderProfesores();
  }
};

document.getElementById('form-profesor')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('profesor-id').value;
  const fotoFile = document.getElementById('foto-profesor').files[0];
  const fotoUrl = fotoFile ? URL.createObjectURL(fotoFile) : null;

  const datos = {
    nombre: document.getElementById('nombre-profesor').value.trim(),
    email: document.getElementById('email-profesor').value.trim(),
    cursos: Array.from(document.getElementById('cursos-profesor').selectedOptions).map(o => parseInt(o.value))
  };

  const lista = DB.get('profesores');
  if (id) {
    const index = lista.findIndex(x => x.id === parseInt(id));
    lista[index] = { ...lista[index], ...datos, foto: fotoUrl || lista[index].foto };
  } else {
    datos.id = Date.now();
    datos.foto = fotoUrl || 'assets/default-avatar.png';
    lista.push(datos);
  }
  DB.set('profesores', lista);
  renderProfesores();
  cerrarModal();
});

// CURSOS 
function renderCursos() {
  const cursos = DB.get('cursos');
  const list = document.getElementById('cursos-list');
  if (!list) return;

  list.innerHTML = cursos.length === 0
    ? '<p class="no-data">No hay cursos creados</p>'
    : cursos.map(c => `
      <div class="item-card">
        <div>
          <h4>${c.nombre}</h4>
          <p>${c.descripcion || 'Sin descripción'}</p>
        </div>
        <div>
          <button onclick="editarCurso(${c.id})" class="btn-editar">Editar</button>
          <button onclick="eliminarCurso(${c.id})" class="btn-eliminar">Eliminar</button>
        </div>
      </div>
    `).join('');
}

window.editarCurso = (id) => abrirModal('curso', id);
window.eliminarCurso = (id) => {
  if (confirm('¿Eliminar curso y todos sus módulos?')) {
    DB.set('cursos', DB.get('cursos').filter(c => c.id !== id));
    DB.set('modulos', DB.get('modulos').filter(m => m.cursoId !== id));
    const profes = DB.get('profesores');
    profes.forEach(p => p.cursos = p.cursos.filter(cid => cid !== id));
    DB.set('profesores', profes);
    renderCursos();
    renderModulos();
  }
};

document.getElementById('form-curso')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('curso-id').value;
  const datos = {
    nombre: document.getElementById('nombre-curso').value.trim(),
    descripcion: document.getElementById('descripcion-curso').value.trim()
  };

  const lista = DB.get('cursos');
  if (id) {
    const index = lista.findIndex(x => x.id === parseInt(id));
    lista[index] = { ...lista[index], ...datos };
  } else {
    datos.id = Date.now();
    lista.push(datos);
  }
  DB.set('cursos', lista);
  renderCursos();
  cargarCursosEnSelects();
  cerrarModal();
});

// MÓDULOS
function renderModulos() {
  const modulos = DB.get('modulos');
  const cursos = DB.get('cursos');
  const list = document.getElementById('modulos-list');
  if (!list) return;

  list.innerHTML = modulos.length === 0
    ? '<p class="no-data">No hay módulos creados</p>'
    : modulos.map(m => {
      const curso = cursos.find(c => c.id === m.cursoId);
      return `
        <div class="item-card">
          <div>
            <h4>${m.nombre}</h4>
            <p>Curso: ${curso?.nombre || 'Eliminado'}</p>
            <small>${m.lecciones?.length || 0} lecciones</small>
          </div>
          <div>
            <button onclick="editarModulo(${m.id})" class="btn-editar">Editar</button>
            <button onclick="eliminarModulo(${m.id})" class="btn-eliminar">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');
}

window.editarModulo = (id) => abrirModal('modulo', id);
window.eliminarModulo = (id) => {
  if (confirm('¿Eliminar módulo y sus lecciones?')) {
    DB.set('modulos', DB.get('modulos').filter(m => m.id !== id));
    renderModulos();
  }
};

document.getElementById('form-modulo')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('modulo-id').value;
  const datos = {
    nombre: document.getElementById('nombre-modulo').value.trim(),
    cursoId: parseInt(document.getElementById('curso-modulo').value),
    lecciones: id ? DB.get('modulos').find(m => m.id === parseInt(id))?.lecciones || [] : []
  };

  const lista = DB.get('modulos');
  if (id) {
    const index = lista.findIndex(x => x.id === parseInt(id));
    lista[index] = { ...lista[index], ...datos };
  } else {
    datos.id = Date.now();
    lista.push(datos);
  }
  DB.set('modulos', lista);
  renderModulos();
  cerrarModal();
});

function renderAdministradores() {
  const admins = DB.get('administradores');
  const list = document.getElementById('administradores-list');
  if (!list) return;

  list.innerHTML = admins.length === 0
    ? '<p class="no-data">No hay administradores registrados</p>'
    : admins.map(a => `
      <div class="item-card">
        <div>
          <h4>${a.nombre}</h4>
          <p>${a.email}</p>
        </div>
        <div>
          <button onclick="editarAdmin(${a.id})" class="btn-editar">Editar</button>
          <button onclick="eliminarAdmin(${a.id})" class="btn-eliminar">Eliminar</button>
        </div>
      </div>
    `).join('');
}

window.editarAdmin = (id) => abrirModal('admin', id);

window.eliminarAdmin = (id) => {
  if (confirm('¿Estás seguro de eliminar este administrador?')) {
    DB.set('administradores', DB.get('administradores').filter(a => a.id !== id));
    renderAdministradores();
  }
};

document.getElementById('form-admin')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('admin-id').value;
  const datos = {
    nombre: document.getElementById('nombre-admin').value.trim(),
    email: document.getElementById('email-admin').value.trim(),
  };

  const lista = DB.get('administradores');
  if (id) {
    const index = lista.findIndex(a => a.id === parseInt(id));
    lista[index] = { ...lista[index], ...datos };
  } else {
    datos.id = Date.now();
    lista.push(datos);
  }
  DB.set('administradores', lista);
  renderAdministradores();
  cerrarModal();
});

function cargarCursosEnSelects() {
  const selects = ['cursos-profesor', 'curso-modulo'];
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const cursos = DB.get('cursos');
    select.innerHTML = '<option value="">-- Seleccionar curso --</option>';
    cursos.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id; opt.textContent = c.nombre;
      select.appendChild(opt);
    });
  });
}

function abrirModal(tipo, id = null) {
  document.getElementById('modal-title').textContent = (id ? 'Editar' : 'Nuevo') + ' ' +
    {estudiante:'Estudiante', profesor:'Profesor', curso:'Curso', modulo:'Módulo', admin:'Administrador'}[tipo];

  document.querySelectorAll('.form-section').forEach(s => s.style.display = 'none');
  document.querySelector(`#form-${tipo}`).parentElement.style.display = 'block';

  if (id) {
    document.getElementById(`${tipo}-id`).value = id;
    const datos = DB.get(tipo === 'admin' ? 'administradores' : tipo + 's').find(x => x.id === id);
    if (datos) {
      Object.keys(datos).forEach(key => {
        const input = document.getElementById(`${key}-${tipo}`) || document.getElementById(key);
        if (input && key !== 'id' && key !== 'foto' && key !== 'cursos' && key !== 'lecciones') {
          input.value = datos[key] || '';
        }
        if (key === 'cursos' && input?.tagName === 'SELECT') {
          Array.from(input.options).forEach(opt => opt.selected = datos.cursos.includes(parseInt(opt.value)));
        }
      });
    }
  } else {
    document.getElementById(`${tipo}-id`).value = '';
    document.getElementById(`form-${tipo}`).reset();
  }

  document.getElementById('modal').classList.add('active');
}

function cerrarModal() {
  document.getElementById('modal').classList.remove('active');
}

document.querySelector('.close-modal').onclick = cerrarModal;
window.onclick = (e) => { if (e.target === document.getElementById('modal')) cerrarModal(); };
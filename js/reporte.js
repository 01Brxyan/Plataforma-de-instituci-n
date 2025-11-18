document.addEventListener('DOMContentLoaded', () => {
    const cursos = JSON.parse(localStorage.getItem('eduPlatform_cursos') || '[]');
    const profesores = JSON.parse(localStorage.getItem('eduPlatform_profesores') || '[]');
    
    document.getElementById('fecha-actual').textContent = new Date().toLocaleDateString('es-CO');
    document.getElementById('total-cursos').textContent = cursos.length;
  
    const tabla = document.getElementById('cuerpo-tabla');
    const sinCursos = document.getElementById('sin-cursos');
  
    if (cursos.length === 0) {
      sinCursos.style.display = 'block';
      return;
    }
  
    sinCursos.style.display = 'none';
  
    let totalModulos = 0;
    let totalLecciones = 0;
    let totalHoras = 0;
    let totalEstudiantes = 0;
  
    cursos.forEach(curso => {
      const modulos = curso.modulos?.length || 0;
      const lecciones = curso.modulos?.reduce((acc, m) => acc + (m.lecciones?.length || 0), 0) || 0;
      const horas = curso.intensidadHoraria || Math.round(lecciones * 2.5); // estimado realista
      const profesor = profesores.find(p => p.cursos?.includes(curso.id));
      const estudiantesCount = curso.estudiantes?.length || 0;
  
      totalModulos += modulos;
      totalLecciones += lecciones;
      totalHoras += horas;
      totalEstudiantes += estudiantesCount;
  
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><strong>${curso.nombre}</strong></td>
        <td>${modulos}</td>
        <td>${lecciones}</td>
        <td>${horas} horas</td>
        <td>${profesor ? profesor.nombre + ' ' + (profesor.apellido || '') : 'Sin asignar'}</td>
        <td>${estudiantesCount}</td>
      `;
      tabla.appendChild(fila);
    });
  
    // Fila Total
    const filaTotal = document.createElement('tr');
    filaTotal.className = 'total-row';
    filaTotal.innerHTML = `
      <td><strong>TOTAL GENERAL</strong></td>
      <td><strong>${totalModulos}</strong></td>
      <td><strong>${totalLecciones}</strong></td>
      <td><strong>${totalHoras} horas</strong></td>
      <td colspan="2"><strong>${totalEstudiantes} estudiantes inscritos</strong></td>
    `;
    tabla.appendChild(filaTotal);
  });
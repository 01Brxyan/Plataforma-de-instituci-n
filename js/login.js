const STORAGE_KEY = 'eduPlatform';

document.addEventListener('DOMContentLoaded', function () {
    const formEstudiante = document.getElementById('form-estudiante');
    const btnProfesor = document.getElementById('btn-profesor');

    // Login como Estudiante
    formEstudiante?.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email-estudiante')?.value.trim().toLowerCase();
        const password = document.getElementById('password-estudiante')?.value;

        if (!email || !password) {
            alert('Llena todos los campos, ome');
            return;
        }

        const estudiantes = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_estudiantes`)) || [];
        const estudiante = estudiantes.find(s => s.email === email);

        if (!estudiante) {
            alert('Ese correo no está registrado como estudiante');
            return;
        }

        const hashCorrecto = estudiante.passwordHash || btoa('123456');
        if (btoa(password) === hashCorrecto) {
            localStorage.setItem('estudianteLogueado', JSON.stringify(estudiante));
            alert(`¡Bienvenido, ${estudiante.nombre}!`);
            window.location.href = 'homeestudiante.html';
        } else {
            alert('Contraseña incorrecta');
        }
    });

    // Login como Profesor
    btnProfesor?.addEventListener('click', function () {
        const email = prompt('Correo del profesor:');
        const password = prompt('Contraseña del profesor:');

        if (!email || !password) {
            alert('Debes ingresar ambos datos');
            return;
        }

        const profesores = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_profesores`)) || [];
        const profesor = profesores.find(p => p.email && p.email.toLowerCase() === email.toLowerCase());

        if (!profesor) {
            alert('Profesor no encontrado');
            return;
        }

        // Si no tiene contraseña, usa 123456 por defecto (como en estudiantes)
        const hashCorrecto = profesor.passwordHash || btoa('123456');
        if (btoa(password) === hashCorrecto) {
            localStorage.setItem('profesorLogueado', JSON.stringify(profesor));
            alert(`¡Bienvenido, profesor ${profesor.nombre}!`);
            window.location.href = 'homeprofesor.html';
        } else {
            alert('Contraseña incorrecta');
        }
    });
});

// Mostrar/Ocultar contraseña
function togglePass(inputId, iconSpan) {
    const input = document.getElementById(inputId);
    const icon = iconSpan.querySelector('i');
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }
}
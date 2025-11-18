const STORAGE_KEY = 'eduPlatform';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-login');

    if (!form) {
        console.error('ERROR HIJUEPUTA: No se encontró el formulario con id="form-login"');
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email')?.value.trim().toLowerCase();
        const password = document.getElementById('password')?.value;

        if (!email || !password) {
            alert('Llena todos los campos, ome');
            return;
        }

        const estudiantes = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_estudiantes`)) || [];
        const estudiante = estudiantes.find(s => s.email === email);

        if (!estudiante) {
            alert('Ese correo no está registrado, canson');
            return;
        }

        const hashCorrecto = estudiante.passwordHash || btoa('123456');
        if (btoa(password) === hashCorrecto) {
            localStorage.setItem('estudianteLogueado', JSON.stringify(estudiante));

            alert(`¡Bienvenido de vuelta, ${estudiante.nombre} ${estudiante.apellido || ''}!`);

            window.location.href = 'homeestudiante.html';
        } else {
            alert('Contraseña incorrecta, hijueputa');
        }
    });
});

function togglePass() {
    const pass = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');
    if (pass && icon) {
        if (pass.type === 'password') {
            pass.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            pass.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }
}